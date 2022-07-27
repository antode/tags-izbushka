<!-- todo вместо полного пересчёта цвета слов, сохранять цвет напрямую в слово backgroundColor: wordBackgroundColor(word.id) -->
<!-- todo по клику на сохраненную переводить фокус, страницу пагинации и подсвечивать -->
<!-- todo запретить пересечения тегированных -->
<!-- todo регулировку размера пагинации -->
<!-- todo оптимизировать и кешировать парсинг текста -->

<template>
  <div style="height: 100%">
    <div class="row">
      <div class="column">
      <span style="white-space: pre-wrap">
        <span v-for="word in paginated()"
              v-bind:key="word.id"
              v-bind:style="{backgroundColor: wordBackgroundColor(word.id)}"
              v-on:click.ctrl="start(word, $event)"
              v-on:click.alt="end(word, $event)"
        >{{ word.text }}</span>
        </span>
      </div>
      <div class="column">
        <div class="tagged"
             v-for="(taggedSentence) in tagged.filter(element => element.tag === this.currentTag && element.text === this.currentTextId)"
             v-on:click.ctrl.alt="remove(taggedSentence)"
        >
          <span>{{ getText(taggedSentence) }}</span>
        </div>
      </div>
    </div>
    <div class="bottom-panel">
      <div class="pagination">
        <span v-if="getPages().first !== null">
          <button class="pagination__page"
                  style="padding-right: 3px"

                  v-on:click="changePage(getPages().first)"
          >
            {{ getPages().first + 1 }}
          </button>
          ...
        </span>
        <button class="pagination__page"
                v-for="page in getPages().list"
                v-on:click="changePage(page)"
                v-bind:style="{backgroundColor: page === currentPages[currentTextId] ? 'wheat' : 'white'}"
        >
          {{ page + 1 }}
        </button>
        <span v-if="getPages().last !== null">
          ...
          <button class="pagination__page"
                  style="padding-right: 3px"
                  v-on:click="changePage(getPages().last)"
          >
            {{ getPages().last + 1 }}
          </button>
        </span>
      </div>
      <div class="app-select" >
        <select v-model="currentTag" v-on:change="saveTag()"  style="font-size: x-large; color: brown">
          <option value="">--Please choose an option--</option>
          <option v-for="tag in tags"
                  v-bind:value="tag"
          >{{ tag }}</option>
        </select>
      </div>
      <div class="app-select" >
        <select v-model="currentTextId"
                v-on:change="changeText()"
                style="font-size: x-large; color: brown"
        >
          <option v-for="textId in Object.keys(texts)"
                  v-bind:value="textId"
          >{{ textsTitles[textId].long }}</option>
        </select>
      </div>
      <div v-if="isTextParsingError">
        <span class="warning">
          Текст обработан не полностью
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import text_s from './text_s';
import text_p1 from './text_p1';
import text_p2 from './text_p2';
import text_p3 from './text_p3';
import text_b1 from './text_b1';
import text_b2 from './text_b2';

const pageDelimiterRE = /\/л\.(?:|\s)\d+(?:|(?:|\s)об\.)\//;

export default {
  data() {
    return {
      isTextParsingError: false,
      words: [],
      selection: {
        start: null,
        end: null
      },
      tagged: [],
      tags: [
        'Человек',
        'Артефакт',
        'Перевод',
        'Детали',
        'Клише',
        'Неизвестность',
      ],
      currentTag: '',
      pagination: [],
      currentTextId: 'p1',
      currentPages: {
        p1: 0,
        p2: 0,
        p3: 0,
        b1: 0,
        b2: 0,
        s: 0,
      },
      texts: {
        p1: text_p1,
        p2: text_p2,
        p3: text_p3,
        b1: text_b1,
        b2: text_b2,
        s: text_s,
      },
      textsTitles: {
        p1: {
          short: 'П1',
          long: 'Петлин 1',
        },
        p2: {
          short: 'П2',
          long: 'Петлин 2',
        },
        p3: {
          short: 'П3',
          long: 'Петлин 3',
        },
        b1: {
          short: 'Б1',
          long: 'Байков 1',
        },
        b2: {
          short: 'Б2',
          long: 'Байков 2',
        },
        s: {
          short: 'С',
          long: 'Спафарий',
        },
      },
    }
  },
  created() {
    const self = this;

    document.addEventListener('keyup', function (evt) {
      if (evt.key === 'Escape') {
        self.clear();
      }
    });

    document.addEventListener('keyup', function (evt) {
      if (evt.ctrlKey && evt.key === 'Enter') {
        self.save();
      }
    });


    try {
      const tagged = JSON.parse(localStorage.getItem('tagged'));

      if (tagged !== null) {
        this.tagged = tagged;
      }
    } catch (e) {
    }

    try {
      const currentTextId = JSON.parse(localStorage.getItem('currentTextId'));

      if (currentTextId !== null) {
        this.currentTextId = currentTextId;
      }
    } catch (e) {
    }

    try {
      const currentPages = JSON.parse(localStorage.getItem('currentPages'));

      if (currentPages !== null) {
        this.currentPages = currentPages;
      }
    } catch (e) {
    }

    try {
      const currentTag = JSON.parse(localStorage.getItem('currentTag'));

      if (currentTag !== null) {
        this.currentTag = currentTag;
      }
    } catch (e) {
    }

    this.parseText();
  },
  methods: {
    changeText() {
      localStorage.setItem('currentTextId', JSON.stringify(this.currentTextId));
      this.parseText();
    },
    parseText() {
      let pagesRawRE = null;
      let wordsRE = null;
      let wordsSplitRE = null;

      switch (this.currentTextId) {
        case "b1":
          pagesRawRE = /\/с\.\s\d+?\/.+?(?=\/с\.|$)/gs;
          wordsRE = /(?<text>(?<page>\/с\.\s\d+\/).+)/s;
          wordsSplitRE = /(\/с\.\s\d+\/)|(\s)|(\n)/;
          break;
        default:
          pagesRawRE = new RegExp(`${pageDelimiterRE.source}.+?(?=(?:${pageDelimiterRE.source})|$)`, 'gs');
          wordsRE = new RegExp(`(?<text>(?<page>${pageDelimiterRE.source}).+)`, 's');
          wordsSplitRE = new RegExp(`(${pageDelimiterRE.source})|(\\s)|(\\n)`);
      }

      const pagesRaw = this.texts[this.currentTextId].match(pagesRawRE);

      let wordId = 0;
      let paginationId = 0;
      this.pagination = [];
      this.words = [];

      for (const [index, pageRaw] of pagesRaw.entries()) {
        if (typeof this.pagination[paginationId] === 'undefined') {
          this.pagination[paginationId] = [];
        }

        const match = pageRaw.match(wordsRE);

        for (const word of match.groups.text.split(wordsSplitRE)) {
          if (word === '' || word === undefined) continue;

          this.words[wordId] = {page: match.groups.page, text: word, id: wordId};

          this.pagination[paginationId].push({page: match.groups.page, text: word, id: wordId});

          wordId++;
        }

        if ((index + 1) % 4 === 0) {
          paginationId++;
        }
      }

      const charsInText = this.texts[this.currentTextId].length;

      let charsParsed = 0;
      for (const word of this.words) {
        charsParsed += word.text.length;
      }

      this.isTextParsingError = false;
      if (charsInText !== charsParsed) {
        console.log(`charsInText: ${charsInText}, charsParsed: ${charsParsed}`)
        this.isTextParsingError = true;
      }
    },
    saveTag() {
      localStorage.setItem('currentTag', JSON.stringify(this.currentTag));
    },
    getPages() {
      let sliceStart = this.currentPages[this.currentTextId] - 3;
      let sliceEnd = this.currentPages[this.currentTextId] + 3;

      if (sliceStart < 0) {
        sliceStart = 0;
        sliceEnd = 6;
      }

      if (sliceEnd > this.pagination.length - 1) {
        sliceEnd = this.pagination.length - 1;
      }

      const pages = {
        list: [],
        first: null,
        last: null,
      };

      for (let i = sliceStart; i <= sliceEnd; i++) {
        pages.list.push(i);
      }

      if (sliceStart !== 0) {
        pages.first = 0;
      }

      if (sliceEnd !== this.pagination.length - 1) {
        pages.last = this.pagination.length - 1;
      }

      return pages;
    },
    changePage(page) {
      this.currentPages[this.currentTextId] = page;

      localStorage.setItem('currentPages', JSON.stringify(this.currentPages));
    },
    paginated() {
        return this.pagination[this.currentPages[this.currentTextId]];
    },
    getText(taggedSentence) {
      let text = '';
      let pages = [];

      const pageTextRE = new RegExp(`${pageDelimiterRE.source}|(\\/с\\.\\s\\d+\\/)`);

      for (let i = taggedSentence.start; i <= taggedSentence.end; i++) {
        if (pages.indexOf(this.words[i].page) === -1) {
          pages.push(this.words[i].page);
        }

        if (pageTextRE.test(this.words[i].text)) {
          continue;
        }

        text += this.words[i].text;
      }

      text.replace(/\s+/g, ' ');

      let firstPageText = pages.shift()
        .replace(/\//g, '')
        .replace(/\s+/g, '');

      const firstPageParts = firstPageText
        .match(/(?<leadLetter>[а-я])(?<rest>.+)/i);

      firstPageText = firstPageParts.groups.leadLetter.toUpperCase() + firstPageParts.groups.rest;

      let lastPageText = null;
      if (pages.length > 0) {
        lastPageText = pages.pop()
            .replace(/\//g, '')
            .replace(/\s+/g, '');

        console.log(lastPageText);
        const lastPageParts = lastPageText
            .match(/[а-я]\.(?<rest>.+)/i);

        lastPageText = lastPageParts.groups.rest
      }

      const textTitle = this.textsTitles[taggedSentence.text].short;

      const pagesText = lastPageText === null
        ? `(${textTitle}: ${firstPageText})`
        : `(${textTitle}: ${firstPageText}-${lastPageText})`;

      return text + ' ' + pagesText;
    },
    remove(taggedSentence) {
      const taggedSentenceIndex = this.tagged.findIndex(
          element => element.tag === taggedSentence.tag
              && element.text === taggedSentence.text
              && element.start === taggedSentence.start
              && element.end === taggedSentence.end
      );

      this.tagged.splice(taggedSentenceIndex, 1);

      const taggedStringify = JSON.stringify(this.tagged);

      localStorage.setItem('tagged', taggedStringify);

      fetch('/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: taggedStringify,
      })
          .then(response => response.text())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    },
    wordBackgroundColor(wordId) {
      const selectionStartId = typeof this.selection.start?.id !== 'undefined' ? this.selection.start.id : null;
      const selectionEndId = typeof this.selection.end?.id !== 'undefined' ? this.selection.end.id : null;

      for (const taggedPart of this.tagged) {
        if (taggedPart.tag !== this.currentTag || taggedPart.text !== this.currentTextId) {
          continue;
        }

        if (wordId >= taggedPart.start && wordId <= taggedPart.end) {
          return '#c1d7c1';
        }
      }

      if (selectionStartId === null && selectionEndId === null) {
        return 'White';
      }

      if (wordId === selectionStartId && selectionEndId === null) {
        return 'Wheat';
      }

      if (wordId >= selectionStartId && wordId <= selectionEndId) {
        return 'Wheat';
      }
    },
    start(word) {
      if (this.selection.end !== null && word.id > this.selection.end.id) {
        alert('Начало не должно быть после конца.');
        return;
      }

      this.selection.start = word;
    },
    end(word) {
      if (this.selection.start === null) {
        alert('Сначала установите начало.');
        return;
      }

      if (word.id < this.selection.start.id) {
        alert('Конец не должен быть раньше начала.');
        return;
      }

      this.selection.end = word;
    },
    clear() {
      this.selection.start = null;
      this.selection.end = null;
    },
    save() {
      if (this.currentTag === '') {
        alert('Нужно выбрать тег.');
        return;
      }

      if (this.selection.start === null) {
        alert('Не установлено начало.');
        return;
      }

      if (this.selection.end === null) {
        alert('Не установлен конец.');
        return;
      }

      this.tagged.push({
        tag: this.currentTag,
        start: this.selection.start.id,
        end: this.selection.end.id,
        text: this.currentTextId,
      });

      this.clear();

      const taggedStringify = JSON.stringify(this.tagged);

      localStorage.setItem('tagged', taggedStringify);

      fetch('/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: taggedStringify,
      })
          .then(response => response.text())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    },
  },
}
</script>

<style>
.row {
  display: flex;
  height: 95%;
}

.column {
  flex: 50%;
  padding-left: 10px;
  padding-right: 10px;
  overflow: scroll;
}

.tagged {
  padding-bottom: 10px;
}

.bottom-panel {
  display: flex;
  padding: 10px;
  text-align: center;
  height: 5%;
  overflow: scroll;
}

.pagination {
  flex: 30%;
}

.app-select {
  text-align:center;
  flex: 30%;
}

.pagination__page {
  padding: 5px;
}

.warning {
  opacity: 1;
  color: red;
  font-weight: bold;
  animation: blinker 0.5s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>

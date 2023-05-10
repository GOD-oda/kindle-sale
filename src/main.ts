import { parse } from 'node-html-parser';

interface BookData {
  title: string;
  href: string;
}

export function main() {
  const res = UrlFetchApp.fetch('https://yapi.ta2o.net/kndlsl/hgwr/');
  const html = res.getContentText('UTF-8');
  
  const root = parse(html);
  const li = root.querySelectorAll('ul.book-list > li');
  const list: BookData[] = [];
  li.forEach(function (ele) {
    const a = ele.querySelector('a');
    const title = a?.rawText;
    const href = a?.getAttribute('href');
    
    if (title == undefined || href == undefined) {
      return;
    }
    
    list.push({
      title: title,
      href: href
    })
  });
  
  
  const headers = { "Content-type": "application/json" };
  const payload = createPayload(list);
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(payload)
    // "muteHttpExceptions": true
  };
  
  UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('SLACK_AMAZON_CHANNEL'), options);
}
declare let global: any;
global.main = main;

function createPayload(list: BookData[]) {
  const fields = list.map(function (bookData: BookData) {
    return {
      value: Utilities.formatString('<%s | %s>', bookData.href, bookData.title)
    };
  });
  
  return {
    username: 'Kindle日替わりセール',
    attachments: [{
      color: "36a64f",
      fields: fields
    }],
    icon_emoji: ':kindle_logo_icon:'
  };
}

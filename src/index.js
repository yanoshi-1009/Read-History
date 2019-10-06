(function() {
  "use strict";

  const getBookInformation = ISBN => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`;

    kintone.proxy(url, "GET", {}, {}).then(resp => {
      const respBookInformation = JSON.parse(resp[0]);

      if (respBookInformation.totalItems === 0) {
        alert("該当の書籍が見つかりませんでした");
        return;
      }

      const record = kintone.app.record.get();
      const bookInformation = respBookInformation.items[0].volumeInfo;
      const title = bookInformation.title;
      const authors = bookInformation.authors.join(" ");
      const publishedDate = bookInformation.publishedDate;
      const description = bookInformation.description;

      record.record.title.value = title;
      record.record.authors.value = authors;
      record.record.publishedDate.value = publishedDate;
      record.record.description.value = description;
      kintone.app.record.set(record);
    });
  };

  kintone.events.on(
    ["app.record.create.change.ISBN_13", "app.record.edit.change.ISBN_13"],
    event => {
      const record = event.record;
      const ISBN = record.ISBN_13.value;
      getBookInformation(ISBN);
    }
  );
})();

var replace = require("replace");

replace({
  regex: "\"{{",
  replacement: "{{",
  paths: ['./dist/assets/styles.css.twig'],
  recursive: true,
  silent: true,
});
replace({
  regex: "}}\"",
  replacement: "}}",
  paths: ['./dist/assets/styles.css.twig'],
  recursive: true,
  silent: true,
});
replace({
  regex: "}}px\"",
  replacement: "}}px",
  paths: ['./dist/assets/styles.css.twig'],
  recursive: true,
  silent: true,
});

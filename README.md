# @theredhead/core-functions

- [@theredhead/core-functions](#theredheadcore-functions)
  - [Purpose](#purpose)
    - [Searching](#searching)
      - [What is the goal with search?](#what-is-the-goal-with-search)
      - [What is a search expression?](#what-is-a-search-expression)
        - [Case and Accent sensitivity](#case-and-accent-sensitivity)
    - [API](#api)
      - [String manipulation](#string-manipulation)
        - [`replaceAll(template: string, placeholder: string, replacement: string): string`](#replacealltemplate-string-placeholder-string-replacement-string-string)
        - [`fmt(template: string, args: KeyValueMap<any> | any[]): string`](#fmttemplate-string-args-keyvaluemapany--any-string)
        - [`removeDiacritics(s: string): string`](#removediacriticss-string-string)
        - [`sluggify(s: string): string`](#sluggifys-string-string)
        - [`ucFirst(s: string, useLocale: boolean = true): string`](#ucfirsts-string-uselocale-boolean--true-string)
        - [`lcFirst(s: string, useLocale: boolean = true): string`](#lcfirsts-string-uselocale-boolean--true-string)
        - [`pascalize(s: string, useLocale: boolean = true): string`](#pascalizes-string-uselocale-boolean--true-string)
      - [Searching and sorting arrays](#searching-and-sorting-arrays)
        - [`search<T>(arr: T[], expression: string|SearchExpression): T[]`](#searchtarr-t-expression-stringsearchexpression-t)
        - [`objectMatchesExpression(o: any, expression: SearchExpression): boolean`](#objectmatchesexpressiono-any-expression-searchexpression-boolean)

## Purpose

Provide utility functions. Notably: search and string manipulation.

### Searching

#### What is the goal with search?

One of the more important purposes of this package is to provide a simple yet powerful `search` feature. The goal is to have a simple yet powerful means of search (through in memory objects) that provide a consistent experience to end users. For example when filtering lists and tables.

A simple API to implement such a feature quickly is provided with the `search<T>(arr: T[]expression: string): T[]` function.

This can look as simple as:

```typescript

const skywalkers = search(charactersInStarWars, 'skywalker');

```

#### What is a search expression?

In essense, an expressin in the context of search is a string that describes how exactly to match objects when filtering. in essense, all the expression is split on whitespace, except when that whitespace is within double quotes. For an object to match an expression; every snippet from the expression must be present somewhere in the object. There is an exception though.

When a snippet is prefixed with an exclamation mark (!), the entire rest of the snippet must be an exact match for at least one value in the object being evaluated.

for example; an expression string of `The, "!Quick brown" fox jumps over the "lazy dog".` would end up with the following snippets: `The,`, `!Quick brown`, `fox`, `jumps`, `over`, `the`, `lazy dog`, and `.`.

Only objects that contain ALL of these snippets in some property but have at least one property with the exact value `Quick brown` would be found using this expression.

##### Case and Accent sensitivity

By default search is case insensitive and accent sensitive but it is possible to search case sensitively and/or accent insensitively.

```typescript

  const expression = parseSearchExpression(searchText);
  expression.caseSensitive = true;
  expression.accentSensitive = true;

  const found = search(haystack, expression);

```

### API

#### String manipulation

##### `replaceAll(template: string, placeholder: string, replacement: string): string`

Replaces all occurrences of a placeholder in a given template string with the given replacement. An unfortunate requirement because the javascript string object cannot reliably do this by itselt (until ECMA2021).

##### `fmt(template: string, args: KeyValueMap<any> | any[]): string`

Replaces placeholders in template strings with replacements from an array or KeyValueMap argument. Keys or indices must be marked for replacement in the template by enclosing them in accolades.

When using a KeyValueMap, marked keys from the map are replaced in the template with their values from the object.

```typescript
  const template = "{foo} {bar} {baz} sit amet.";
  const result = fmt(template, {
    foo: "Lorum",
    bar: "ipsum",
    baz: "dolar",
  });

  expect(result).toBe("Lorum ipsum dolar sit amet.");
```

When using an array, each marked index from the array is replaced with its' corresponding value in the array.

```typescript
  const template = "{0} {0} {0} sit amet.";
  const result = fmt(template, [
    "Lorum",
    "ipsum",
    "dolar",
  ]);

  expect(result).toBe("Lorum ipsum dolar sit amet.");
```

##### `removeDiacritics(s: string): string`

Remove accents from string by replacing them with the nearest non-accented character

##### `sluggify(s: string): string`

Makes easy to type, url passable versions of names.

##### `ucFirst(s: string, useLocale: boolean = true): string`

Return a string identical to the input string but with the first character uppercased

##### `lcFirst(s: string, useLocale: boolean = true): string`

Return a string identical to the input string but with the first character lowercased

##### `pascalize(s: string, useLocale: boolean = true): string`

Transform kebab-case, under_scored and regularly spaced strings into PascalCase

#### Searching and sorting arrays

##### `search<T>(arr: T[], expression: string|SearchExpression): T[]`

Filters an array (without modifying the original array) by comparing each entry to a search expression. and returning only those entries that are a positive match to the expression.

##### `objectMatchesExpression(o: any, expression: SearchExpression): boolean`

Tests one object against a (previously parsed) search expression.

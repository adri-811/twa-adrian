import assert from 'node:assert/strict';
import { items } from './data.js';
import { byCategory, search, total, top, categories, withDiscount } from './catalog.js';

assert.equal(byCategory(items, 'european').length, 2);
assert.equal(search(items, 'direct').length, 5);
assert.equal(total([{ price: 10 }, { price: 20 }]), 30);
assert.equal(top(items, 1)[0].id, 5);
assert.equal(categories(items).length, 4);
assert.equal(withDiscount([{ price: 100 }], 20)[0].price, 80);
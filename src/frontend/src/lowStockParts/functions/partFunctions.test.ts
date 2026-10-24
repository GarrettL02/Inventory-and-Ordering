import { findWebsiteFromURL, grabPartLinkFromComment } from './partFunctions';

describe('grabPartLinkFromComment', () => {
  it('returns undefined when there is no comment', () => {
    expect(grabPartLinkFromComment(undefined)).toBeUndefined();
    expect(grabPartLinkFromComment('')).toBeUndefined();
  });

  it('returns an empty string when the comment has no link', () => {
    expect(grabPartLinkFromComment('order the red ones')).toBe('');
  });

  it('pulls a link out of the middle of a comment', () => {
    const comment = 'buy here https://www.digikey.com/en/products/123 please';

    expect(grabPartLinkFromComment(comment)).toBe('https://www.digikey.com/en/products/123');
  });

  it('understands plain http links', () => {
    expect(grabPartLinkFromComment('http://example.com/a')).toBe('http://example.com/a');
  });

  it('returns only the first link when there are several', () => {
    const comment = 'https://first.com/a and https://second.com/b';

    expect(grabPartLinkFromComment(comment)).toBe('https://first.com/a');
  });
});

describe('findWebsiteFromURL', () => {
  // it.each: same test, many inputs. Each row is [url, expected site name].
  it.each([
    ['https://www.digikey.com/en/products/123', 'digikey'],
    ['https://www.mouser.com/ProductDetail/abc', 'mouser'],
    ['http://mouser.com/x', 'mouser'],
    ['https://www.ti.com/product/LM317', 'ti'],
  ])('finds the site name in %s', (url, expected) => {
    expect(findWebsiteFromURL(url)).toBe(expected);
  });

  it.each([
    ['an empty string', ''],
    ['text with no link', 'not a url'],
    ['a link without http(s)://', 'digikey.com/products'],
  ])('returns "notFound" for %s', (_label, input) => {
    expect(findWebsiteFromURL(input)).toBe('notFound');
  });
});

//------------------------ Part URL --------------------------//
export function grabPartLinkFromComment(
  comment: string | undefined,
): string | undefined {
  if (comment) {
    //const hasLink: string | null  = parts?.comment.includes('http://') || null;
    const url = comment.match(/https?:\/\/[^\s]+/)?.[0];
    return url || '';
  } else return undefined;
}

export function findWebsiteFromURL(url: string): string {
  const websiteName = url.match(/https?:\/\/(?:www\.)?([^\s.]+)\./);
  if (websiteName === null) {
    return 'notFound';
  } else {
    return websiteName[1];
  }
}

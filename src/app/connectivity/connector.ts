export class Connector<I, R> {

  private readonly type: Methods;

  private readonly  url: string;

  private readonly payload: I;

  constructor(type: Methods, url: string, payload: I ) {
    this.type = type;
    this.url = url;
    this.payload = payload;
  }

  dispatch(): Promise<R> {
    return new Promise<R>(((resolve) => {
      fetch(this.url, {
        method: this.type.label,
        mode:'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.payload)
      }).then(response => response.json())
        .then(json => resolve(json as R))
        .catch(() => resolve(null));
    }));
  }

}

export class Methods {

  public static readonly GET = new Methods('GET');

  public static readonly POST = new Methods('POST');

  public static readonly PUT = new Methods('PUT');

  public static readonly DELETE = new Methods('DELETE');



  readonly label: string;

  private constructor(arg: string) { this.label = arg; }

}

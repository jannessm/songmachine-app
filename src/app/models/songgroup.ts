
export class Songgroup {
  public id?: string;
  public name = '';
  public description = '';
  public date ? = null;
  public songs: string[] = []; // uuids of songs

  constructor(params?: string | any) {
    if (typeof params === 'string') {
      this.name = name;
    } else if (params) {
      this.id = params.id;
      this.name = params.name;
      this.description = params.description;
      this.date = params.date;
      this.songs = params.songs;
    }
  }
}

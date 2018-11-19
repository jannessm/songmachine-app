import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HtmlFactoryService } from '../../services/html-factory.service';

const diff = require('diff');

interface Diff {
  value: string;
  added?: boolean;
  removed?: boolean;
  count: number;
}

@Component({
  selector: 'app-merge-dialog',
  templateUrl: './merge-dialog.component.html',
  styleUrls: ['./merge-dialog.component.scss']
})
export class MergeDialogComponent implements OnInit {

  server = '';
  local = '';
  mergedInput = '';

  constructor(
    public dialogRef: MatDialogRef<MergeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private htmlFactory: HtmlFactoryService
  ) {}

  ngOnInit() {
    this.server = this.createHighlightedString(this.data.diffServer);
    this.local = this.createHighlightedString(this.data.diffLocal);
  }

  private createHighlightedString(diffs: Diff[]): string {
    let html = '';
    diffs.forEach(elem => {
      const css = elem.removed ? 'merge-removed' : elem.added ? 'merge-added' : '';
      html += '<pre class="merge ' + css + '">' + this.htmlFactory.highlightText(elem.value).join('<br>') + '</pre>';
    });
    return html + this.htmlFactory.style();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  keepLocal(): void {
    this.dialogRef.close('--**keepLocal**--');
  }

  keepServer(): void {
    this.dialogRef.close('--**keepServer**--');
  }

  saveMerged(): void {
    this.dialogRef.close(this.mergedInput);
  }
}

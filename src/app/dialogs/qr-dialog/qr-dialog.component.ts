import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

const qr = require('qr.js');

@Component({
  selector: 'app-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.scss']
})
export class QRDialogComponent {

  qrcode;

  constructor(public dialogRef: MatDialogRef<QRDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.qrcode = qr(data.url);
  }


  onNoClick(): void {
  }
}

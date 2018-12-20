import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  unpairedDevices:any;
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public BSerial: BluetoothSerial, public loadingCtrl: LoadingController) {
  }


  getUnPairedDevices(){
    console.log("get unpaired devices");
    this.presentLoadingDefault();

    this.BSerial.discoverUnpaired().then(
      (res) => {
        console.log("unpaired" + JSON.stringify(res))
        this.loading.dismiss();
        this.unpairedDevices = res
      },
      (err) => {
        console.log("err in discover " + JSON.stringify(err))
      }      
    )


  }// end of getUnPairedDevices Fcn

  loadDevices(){
    console.log("load devices")
    this.BSerial.isEnabled().then((res) => {
      console.log("bluetooth enabled")
      this.getUnPairedDevices();

    })
  }//end of loadDevices Fcn


  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();

  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}

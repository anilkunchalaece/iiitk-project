import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ChangeDetectorRef } from '@angular/core';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  unpairedDevices:any;
  pairedDevices:any;
  loading:any;
  showData:any = false;
  turbidity:any;
  ph:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public BSerial: BluetoothSerial, public loadingCtrl: LoadingController,
              private cdr: ChangeDetectorRef) {
             
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
  

  pairWithSelectedDevice(index){
    console.log("selected index is "+ index)
    console.log("selected device is" + JSON.stringify(this.unpairedDevices[index]))
    alert("connecting with" + this.unpairedDevices[index].name)
    this.BSerial.connect(this.unpairedDevices[index].address).subscribe((val) => {
      console.log("connected sucessfully " + JSON.stringify(val))
    })
  }// end of pairWithSelectedDevice

  connectWithPairedDevice(index){
    console.log('connect with paired device with index '+ index)
    alert("connecting with" + this.pairedDevices[index].name)
    this.BSerial.connect(this.pairedDevices[index].address).subscribe( (val) => {
      console.log("connected succesfully " + JSON.stringify(val));
    })
  }


  getPairedDevices(){
    console.log("listing all paired devices")
    this.presentLoadingDefault()
    this.BSerial.list().then((res)=> {
      console.log("all the paired devices " + JSON.stringify(res))
      this.pairedDevices = res
      this.loading.dismiss();
    },
    (err) => {
      console.log("err in getting the paired devices " + JSON.stringify(err))
    })
  }//end of getPairedDevices

  sendHelloWorld(){
    this.BSerial.write("Hello World").then( (res) => {
      console.log("data sent " + JSON.stringify(res))
    },
    (err) => {
      console.log("err in sending hello world " + JSON.stringify(err))
    })
  }// end of sendHelloWorld

  readDataFromArduino(){
    this.BSerial.subscribe('\n').subscribe(
      (val) => {
        let data = val.split(',');
        data.forEach(element => {
          if(element.indexOf("T") != -1){
            this.turbidity = element.slice(1)
            console.log(this.turbidity);
          }else if(element.indexOf("P") != -1){
            this.ph = element.slice(1)
          }
        });
        //fucking change detector 
        //ref - https://stackoverflow.com/questions/47017533/ionic-bluetooth-serial-subscriberawdata-update-ui
        this.cdr.detectChanges()
      },
      (err) => {
        console.log("error in subscribing " + JSON.stringify(err));
      })


  }//end of readDataFromArduino

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}

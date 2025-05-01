import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Firebase
import { initializeApp } from "firebase/app";
import { ref, getStorage, getDownloadURL, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHgOaPFiBZ5Uh3LZLTXqcWwtQl5w-JEtQ",
  authDomain: "node-real-estate-d86a8.firebaseapp.com",
  projectId: "node-real-estate-d86a8",
  storageBucket: "node-real-estate-d86a8.appspot.com",
  messagingSenderId: "937364880252",
  appId: "1:937364880252:web:881f08b151198ec25fc2f9",
  measurementId: "G-TQLPGEFEJX"
};

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    productInfo: any;
    products: any;
    product: any;

    id: any;
    city: any;
    name: any;
    type: any;
    rooms: any;
    price: any;
    description: any;
    error: string = "";

    url: any;
    image: any;
    upload: any;

    ngOnInit(): void{}
    ngOnDestroy(): void{}
    ngOnChanges(): void{}

    constructor( private router: Router, public route: ActivatedRoute ){

        window.scrollTo(0, 0);
        try{
          fetch(`https://real-estate-back.up.railway.app/read/${this.route.snapshot.paramMap.get('id')}`)
          // fetch(`http://angular-real-estate-back.herokuapp.com/read/${this.route.snapshot.paramMap.get('id')}`)
          // fetch(`http://localhost:4000/read/${this.route.snapshot.paramMap.get('id')}`)
              .then( response => response.json() )
              .then( data => {
                  this.productInfo = data;

                  console.log("this.productInfo = ", this.productInfo);

                  // this.city = this.productInfo.city;
                  // this.name = this.productInfo.name;
                  // this.type = this.productInfo.type;
                  // this.rooms = this.productInfo.rooms;
                  // this.price = this.productInfo.price;
                  // this.description = this.productInfo.description;
              });
        }catch(error){}

        // try{
        //     fetch("http://localhost:4000/read")
        //         .then( response => response.json() )
        //         .then( data => {
        //             this.products = data;
        //             console.log("products.json => ", this.products);
        //             this.productInfo = this.products.find( (product:any ) => {
        //                 return product.id === this.id;
        //             });
        //             this.city = this.productInfo.city;
        //             this.name = this.productInfo.name;
        //             this.type = this.productInfo.type;
        //             this.rooms = this.productInfo.rooms;
        //             this.price = this.productInfo.price;
        //             this.description = this.productInfo.description;
        //         });
        // }catch(error){}

        this.id = this.route.snapshot.paramMap.get('id');
    }

    // Update individual products with Node API
    updateProduct = async (city:string, name:string, type:string, rooms:string, price:string, description:string, image:string) => {


        // this.url = image;
        console.log("updateProduct() image = ", image);
        console.log("updateProduct() this.url = ", this.url);


        if( !price || !rooms || !description || !type ){
            this.error = "*Type, price, description, and rooms are required";
            return;
        }
        else if( rooms.length >= 56 || type.length >= 56 ){
            this.error = "*Type, price, and rooms must be less than 56 characters";
            return;
        }
        else if( description.length >= 200 ){
          this.error = "*Description must be less than 200 characters";
          return;
      }
        else if( parseInt(price) <= 0 ){
            this.error = "*Price must be greater than 0";
            return;
        }
        this.error = "";

        console.log("update() = > this.url = ", this.url);
        console.log("update() = > this.productInfo.img = ", this.productInfo.img);

        // If new image loaded in update
        if( this.url == null)
            this.url = image;

        try{
            await fetch(`https://real-estate-back.up.railway.app/update/${this.id}`, {
            // await fetch(`http://angular-real-estate-back.herokuapp.com/update/${this.id}`, {
            // await fetch(`http://localhost:4000/update/${this.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' ,
                },
                body: JSON.stringify({
                    id: this.id,
                    city: city,
                    name: name,
                    type: type,
                    description: description,
                    rooms: rooms,
                    price: price,
                    img: this.url
                })
            });
            this.router.navigate(['/products']);

            }catch(err){
              console.error(err);
        }
    }

    deleteProduct = async (id:string) => {
        try{
          await fetch(`https://real-estate-back.up.railway.app/delete/${this.id}`, {
          // await fetch(`http://angular-real-estate-back.herokuapp.com/delete/${this.id}`, {
          // await fetch(`http://localhost:4000/delete/${this.id}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  id: this.id,
              })
          });
          console.log("re-direct /products");
          this.router.navigate(['/products']);

          }catch(err){
              console.error(err);
          }
    }


  // Process selected image file
  fileSelected = async ( event ) => {
    console.log("file target = ", event.target);
    console.log("file name = ", event.target.files[0].name);

    // Preview image
    let reader = new FileReader();
    reader.readAsDataURL( event.target.files[0] );
    //this.productInfo.img = reader.readAsDataURL( event.target.files[0] );

    reader.onload = ( event:any ) => {
        console.log("event.target = ", event.target);

        // Assign to preview image src
        this.upload = reader.result;
    }

    // Upload image to Firestore from Angular
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Storage reference
    const storage = getStorage(app);

    const file = event.target.files[0];
    const storageRef = ref(storage, 'assets/'+ file.name );

      uploadBytes(storageRef, file )
          .then( (snapshot) => {
              console.log('Uploaded file, ', file);
              console.log('snapshot =>', snapshot);

              getDownloadURL(snapshot.ref).then( (url) => {
                  console.log('getDownloadURL() url =>', url);
                  this.url =  url;

                  // if( this.productInfo.img != url)
                  if( this.productInfo.img != url )
                      this.productInfo.img = url;
              });
          })
          .catch( (error) => {
              console.log("File error =>", error);
          })


    // Upload to Node API
    const formData = new FormData();
    formData.append( 'image', event.target.files[0], event.target.files[0].name );

    // this.imgUploads = event.target.files[0].name;

    try{
      await fetch(`https://real-estate-back.up.railway.app/upload`, {
      // await fetch(`http://angular-real-estate-back.herokuapp.com/upload`, {
      // await fetch(`http://localhost:4000/upload`, {
          method: 'POST',
          body: formData
      });
    }catch(err){
        console.error(err);
    }


    // this.http.post('http://localhost:4000/upload', formData, { observe: 'response' })
    //     .subscribe( (response) => {
    //         if (response.status === 200) {
    //             // this.upload = response;
    //             console.log("HTTP response = ", response)
    //             let successResponse = this.upload.body.message;
    //         }
    //         else{
    //             console.log("There has been an error, response = ", response);
    //         }
    //     }
    // );
}

}




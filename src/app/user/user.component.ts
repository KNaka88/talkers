import { Component, OnInit, ElementRef } from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow } from
'angular2-google-maps/core';
import { User } from '../user.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  // preset location and icon
  public uid: string;
  public lat: number = 45.5206726;
  public lng: number = -122.67779689999999;
  public userFbObj: FirebaseObjectObservable<any>;
  public timestamp: any;
  public currentUser: User;
  public userName: string;
  public friendsUid: string;
  users: FirebaseListObservable<any[]>;
  usersFriends: FirebaseListObservable<any[]>;
  public infoWindow: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
          this.setLatLng(location.coords.latitude, location.coords.longitude);
      });
    }
    this.route.params.forEach((urlParameters) => {
      this.uid = urlParameters['id'];
    });

    this.userFbObj = this.userService.getUserById(this.uid);
    this.users = this.userService.getAllUsers();
    this.usersFriends = this.userService.getFriends(this.uid);
  }

  setLatLng(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.userService.updateUserInfo(this.lat, this.lng, this.uid);
  }

  showInfoWindow(){
    this.infoWindow = true;
    console.log(this.infoWindow);
  }


  addFriend(friendUid) {
    this.userService.sendFriendRequest(this.uid, friendUid);
    console.log(friendUid);
  }



  sendMessage(newMessage, friend){
    // 1. get FriendsUid that matches
    this.friendsUid =  "";

    let userFriendsList: any;
    let friendFriendsList: any;

    this.userService.getUserFriendsUid(this.uid).subscribe( (userFriendsListData) => {
      userFriendsList = userFriendsListData;
    });

    this.userService.getFriendFriendsUid(friend.$key).subscribe( (friendFriendsListData) => {
      friendFriendsList = friendFriendsListData;
    });

    console.log(userFriendsList);
    console.log(friendFriendsList);

    alert(this.userService.checkIfMutualFriends(userFriendsList, friendFriendsList));

    // 2. get friendName and userName
    let friendName = friend.displayName;

    this.userService.getUserById(this.uid).subscribe( (user) => {
      this.userName = user.displayName;
    });


    // 3. call userService sendNessage function, passing variables
    // this.userService.sendMessage(newMessage, friendName, this.userName, this.friendsUid);
  }

  // hideInfoWindow(){
  //   this.infoWindow = false;
  // }
}

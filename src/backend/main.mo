import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  let accessControlState = AccessControl.initState(); // Persistent access control state

  include MixinAuthorization(accessControlState);

  type EnquiryId = Nat;

  public type Enquiry = {
    id : EnquiryId;
    name : Text;
    email : Text;
    phone : Text;
    serviceType : Text;
    eventDate : Text;
    location : Text;
    budgetRange : Text;
    duration : Text;
    message : Text;
    status : Text;
    createdAt : Int;
  };

  module Enquiry {
    public func compareByTimestamp(a : Enquiry, b : Enquiry) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  public type EnquiryInput = {
    name : Text;
    email : Text;
    phone : Text;
    serviceType : Text;
    eventDate : Text;
    location : Text;
    budgetRange : Text;
    duration : Text;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextEnquiryId = 1;
  let enquiries = Map.empty<EnquiryId, Enquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions required by frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public enquiry submission - accessible to anyone including guests
  public shared ({ caller }) func submitEnquiry(input : EnquiryInput) : async EnquiryId {
    let enquiryId = nextEnquiryId;
    nextEnquiryId += 1;

    let enquiry : Enquiry = {
      id = enquiryId;
      name = input.name;
      email = input.email;
      phone = input.phone;
      serviceType = input.serviceType;
      eventDate = input.eventDate;
      location = input.location;
      budgetRange = input.budgetRange;
      duration = input.duration;
      message = input.message;
      status = "New";
      createdAt = Time.now();
    };

    enquiries.add(enquiryId, enquiry);
    enquiryId;
  };

  // Admin functions

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    enquiries.values().toArray().sort(Enquiry.compareByTimestamp);
  };

  public query ({ caller }) func getEnquiry(enquiryId : EnquiryId) : async Enquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (enquiries.get(enquiryId)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?enquiry) { enquiry };
    };
  };

  public shared ({ caller }) func updateEnquiryStatus(enquiryId : EnquiryId, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (enquiries.get(enquiryId)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?enquiry) {
        let updatedEnquiry : Enquiry = {
          id = enquiryId;
          name = enquiry.name;
          email = enquiry.email;
          phone = enquiry.phone;
          serviceType = enquiry.serviceType;
          eventDate = enquiry.eventDate;
          location = enquiry.location;
          budgetRange = enquiry.budgetRange;
          duration = enquiry.duration;
          message = enquiry.message;
          status;
          createdAt = enquiry.createdAt;
        };
        enquiries.add(enquiryId, updatedEnquiry);
      };
    };
  };

  public shared ({ caller }) func deleteEnquiry(enquiryId : EnquiryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not enquiries.containsKey(enquiryId)) {
      Runtime.trap("Enquiry not found");
    };
    enquiries.remove(enquiryId);
  };

  public query ({ caller }) func getEnquiryCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    enquiries.size();
  };

  public query ({ caller }) func getEnquiriesByStatus(status : Text) : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let filtered = enquiries.values().toArray().filter(
      func(enquiry) {
        Text.equal(enquiry.status, status);
      }
    );
    filtered.sort(Enquiry.compareByTimestamp);
  };

  public query ({ caller }) func hasEnquiries() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    not enquiries.isEmpty();
  };

  public shared ({ caller }) func getAndMarkEnquiryAsContacted(enquiryId : EnquiryId) : async Enquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (enquiries.get(enquiryId)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?enquiry) {
        // Update status to "Contacted"
        let updatedEnquiry : Enquiry = {
          id = enquiryId;
          name = enquiry.name;
          email = enquiry.email;
          phone = enquiry.phone;
          serviceType = enquiry.serviceType;
          eventDate = enquiry.eventDate;
          location = enquiry.location;
          budgetRange = enquiry.budgetRange;
          duration = enquiry.duration;
          message = enquiry.message;
          status = "Contacted";
          createdAt = enquiry.createdAt;
        };
        enquiries.add(enquiryId, updatedEnquiry);
        updatedEnquiry;
      };
    };
  };
};

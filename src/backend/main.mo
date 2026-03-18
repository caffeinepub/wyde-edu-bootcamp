import List "mo:core/List";



actor {
  type Registration = {
    fullName : Text;
    whatsapp : Text;
    email : Text;
    college : Text;
    courseLevel : Text;
    referral : Text;
    paymentScreenshot : Text;
    timestamp : Text;
  };

  let registrations = List.empty<Registration>();
  let adminPassword = "wydeedu2026";

  public shared ({ caller }) func register(data : Registration) : async () {
    registrations.add(data);
  };

  public shared ({ caller }) func getAllRegistrations(password : Text) : async ?[Registration] {
    if (password == adminPassword) {
      ?registrations.toArray();
    } else {
      null;
    };
  };

  public query ({ caller }) func getRegistrationCount() : async Nat {
    registrations.size();
  };
};

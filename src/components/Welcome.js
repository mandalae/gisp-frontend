import React from "react";

const FB_LINK = "https://www.facebook.com/groups/2663605157100534/?ref=share";

export const Welcome = () => (
  <div>
    <h5>Welcome to GISP</h5>
    <p>
      If you haven't yet signed up to the GISP Facebook feedback group, we would
      recommend you do so.
    </p>
    <p>
      This is where we are currently publishing updates and news about the site,
      as well as collecting feedback for improvements.
    </p>
    <p>
      <a href={FB_LINK}>
        <i className="fa fa-facebook-f"></i> GP Information Sharing Portal
        (Facebook)
      </a>
    </p>
  </div>
);

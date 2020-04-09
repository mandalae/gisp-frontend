import Analytics from '@aws-amplify/analytics';
import Auth from '@aws-amplify/auth';
import appConfig from '../config/app-config.json';

const amplifyConfig = {
  Auth: {
    identityPoolId: appConfig.identityPoolId,
    region: appConfig.region
  }
}
//Initialize Amplify
Auth.configure(amplifyConfig);

const analyticsConfig = {
  AWSPinpoint: {
        // Amazon Pinpoint App Client ID
        appId: appConfig.appId,
        // Amazon service region
        region: appConfig.region,
        mandatorySignIn: false,
  }
}

Analytics.configure(analyticsConfig)

Analytics.autoTrack('session', {
    // REQUIRED, turn on/off the auto tracking
    enable: true,
});

const recordEvent = (name, attributes) => {
    if (attributes) {
        Analytics.record({
            name: name,
            attributes: attributes
        });
    } else {
        Analytics.record(name);
    }
}

export default {
    recordEvent
};

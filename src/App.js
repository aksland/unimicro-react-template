import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { API_BASE_URL } from "./constants";
import './App.css';


function App() {
  const auth = useAuth();
  const [sampleReqResponse, setSampleReqResponse] = useState();

  useEffect(() => {
    if (auth.isAuthenticated) clearUrlParms();
  }, [auth.isAuthenticated]);

  const clearUrlParms = () => {
    window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
  }

  const sendSampleRequest = () => {
    const url = `${API_BASE_URL}/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultAddress`;
    const accessToken = auth?.user?.access_token;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }).then(response => {
      return response.json();
    }).then(data => {
      setSampleReqResponse(data);
      console.log('Data: ', data);
    }).catch(error => {
      console.error('Error: ', error);
    });
  }

  const renderContent = () => {
    if (auth.activeNavigator === 'signinSilent') {
      return <div>Signing you in...</div>;
    }

    if (auth.activeNavigator === 'signoutRedirect') {
      return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
      return <p>Loading...</p>;
    }

    if (auth.error) {
      return <p>Oops... {auth.error.message}</p>;
    }

    if (auth.isAuthenticated) {
      const name = auth.user?.profile?.given_name || auth.user?.profile?.name || auth.user?.profile?.email || 'user';

      return (
        <div>
          <div className="section">
            <p className="sub-title-text">Hello {name.charAt(0).toUpperCase() + name.slice(1)} 👋</p>
            <p>You are now logged in, here is your access token:</p>
            <div className="code-block full-width">
              <code>
                {JSON.stringify(auth?.user?.access_token)?.replaceAll('"', '')}
              </code>
            </div>
          </div>
          <div className="section">
            <p className="sub-title-text">Example usage of the API</p>
            <p>
              The example below shows how you can use the API:
            </p>
            <div className="sample-req">
              <code>GET : {API_BASE_URL}/api/biz/contacts?expand=Info,Info.InvoiceAddress,Info.DefaultPhone,Info.DefaultEmail,Info.DefaultAddress</code>
              <button className="inline-btn" onClick={() => sendSampleRequest()}>Send</button>
            </div>
            {!sampleReqResponse || (
              <div>
                <p className="sample-res-title">Response:</p>
                <div className="code-block full-width">
                  <code>
                    {JSON.stringify(sampleReqResponse)}
                  </code>
                </div>
              </div>
            )}
            <div className="info-container">
              <p className="bold">Important note:</p>
              <ul>
                <li>In order to authenticate successfully with the API, you must pass the access token in the authorization header.</li>
                <li>If you are using a multi-tenant client, you have to make sure that you pass the CompanyKey in the header</li>
                <li>The example above is for a single-tenant client, so you do not need to pass the CompanyKey</li>
              </ul>
            </div>
          </div>
          <div className="section">
            <p className="sub-title-text">Log out</p>
            <p>Click the button below to log out</p>
            <button className="destructive-btn" onClick={() => auth.signoutRedirect()}>Log out</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="steps-title">Follow these simple steps to get started:</p>
        <div className="section">
          <label>Step 1:</label>
          <p>Head over to <a href="https://developer.softrig.com" target="_blank" rel="noreferrer">https://developer.softrig.com</a> and create an application with a SPA client</p>
        </div>
        <div className="section">
          <label>Step 2:</label>
          <p>Edit your OIDC configuration in ./src/constants.js file</p>
          <div className="code-block">
            <code>
              {`const OIDC_CONFIG = {`}<br />&ensp;&ensp;
              {`authority: "<VALUE>",`}<br />&ensp;&ensp;
              {`client_id: "<VALUE>",`}<br />&ensp;&ensp;
              {`redirect_uri: "<VALUE>",`}<br />&ensp;&ensp;
              {`scope: "<VALUE>,"`}<br />&ensp;&ensp;
              {`post_logout_redirect_uri: "<VALUE>,"`}<br />&ensp;&ensp;
              {`silent_redirect_uri: "<VALUE>"`}<br />
              {`}`}
            </code>
          </div>
        </div>
        <div className="section">
          <label>Step 3:</label>
          <p>Click the log in button below after completing the steps above :)</p>
          <button onClick={() => auth.signinRedirect()}>Log in</button>
        </div>
        <img src="/images/artwork.png" className="artwork" alt="logo" />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <img src="/images/logo.png" className="logo" alt="logo" />
        <p>Welcome to the <span className="bold">ReactJs</span> starter project!</p>
      </div>
      {renderContent()}
    </div>
  )
}

export default App;


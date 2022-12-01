/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the whoami canister to check the user's principal.
 */

import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../../declarations/role_permission_core";
import { assistant } from "../../declarations/assistant";

// Autofills the <input> for the II Url to point to the correct canister.
document.body.onload = () => {
  let iiUrl;
  if (process.env.NODE_ENV === "development") {
    iiUrl = `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;
  } else if (process.env.NODE_ENV === "ic") {
    iiUrl = `https://${process.env.INTERNET_IDENTITY_CANISTER_ID}.ic0.app`;
  } else {
    iiUrl = `https://${process.env.INTERNET_IDENTITY_CANISTER_ID}.dfinity.network`;
  }
  document.getElementById("iiUrl").value = iiUrl;
};

document.getElementById("loginBtn").addEventListener("click", async () => {
  // When the user clicks, we start the login process.
  // First we have to create and AuthClient.
  const authClient = await AuthClient.create();

  // Find out which URL should be used for login.
  const iiUrl = document.getElementById("iiUrl").value;

  console.log(iiUrl, 11);

  // Call authClient.login(...) to login with Internet Identity. This will open a new tab
  // with the login prompt. The code has to wait for the login process to complete.
  // We can either use the callback functions directly or wrap in a promise.
  await new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: iiUrl,
      onSuccess: resolve,
      onError: reject,
    });
  });

  // At this point we're authenticated, and we can get the identity from the auth client:
  const identity = authClient.getIdentity();
  // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
  const agent = new HttpAgent({ identity });
  console.log(agent, 111111);
  // Using the interface description of our webapp, we create an actor that we use to call the service methods.
  const core = createActor(canisterId, { agent });
  // Call whoami which returns the principal (user id) of the current user.
  const principal = await core.callerPrincipal();
  console.log(principal, 11111);
  // show the principal on the page
  document.getElementById("loginStatus").innerText = principal.toText();


  // const webapp2 = Actor.createActor(webapp_idl2, {
  //   agent,
  //   canisterId: webapp_id2,
  // });

  // const a = await webapp2.callerPrincipal();
  // console.log(a, 22);

  const b = await core.greet("10002 sss");
  console.log(b, 22);
  const c = await core.my_role();
  console.log(c, 33);

  // admin assign authorized role 
  const e = await core.assign_role(Principal.fromText("md2o2-r3ab2-r3t6m-uwbyp-mx2iq-fr7nc-vbnhd-cxrkh-fpgvx-7xzo5-3ae"), [{ 'authorized' : null }]);
  console.log(e, 33);

  await assistant.addTodo("asasasas");
  const d = await assistant.showTodos();
  console.log(d, 44);

  // check role assigned
  const f = await core.check_role(Principal.fromText("md2o2-r3ab2-r3t6m-uwbyp-mx2iq-fr7nc-vbnhd-cxrkh-fpgvx-7xzo5-3ae"));

    console.log(f, 55);

  // document.getElementById("loginStatus2").innerText = a.toText();
});

document.getElementById("loginBtnPlug").addEventListener("click", async () => {
  // Canister Ids
  const rolePermissionCanisterId = canisterId;

  // Whitelist
  const whitelist = [
    rolePermissionCanisterId
  ];

  // Host local plug after run background
  const host = "http://localhost:33581";

  // Callback to print sessionData
  const onConnectionUpdate = () => {
    console.log(window.ic.plug.sessionManager.sessionData)
  }

  // Make the request
  try {
    const publicKey = await window.ic.plug.requestConnect({
      whitelist,
      host,
      onConnectionUpdate,
      timeout: 5000
    });
    console.log(`The connected user's public key is:`, publicKey);

    // access session principalId
    console.log(window.ic.plug.principalId, 1);
    document.getElementById("loginStatus").innerText = window.ic.plug.principalId;

    // access session accountId
    console.log(window.ic.plug.accountId, 2);

    // access session agent
    console.log(window.ic.plug.agent, 3);

    const core = createActor(canisterId, { agent: window.ic.plug.agent });

    const b = await core.greet("10002 sss");
    console.log(b, 22);
    const c = await core.my_role();
    console.log(c, 33);

    const e = await core.assign_role(Principal.fromText("md2o2-r3ab2-r3t6m-uwbyp-mx2iq-fr7nc-vbnhd-cxrkh-fpgvx-7xzo5-3ae"), [{ 'authorized' : null }]);
    console.log(e, 33);

    const f = await core.check_role(Principal.fromText("md2o2-r3ab2-r3t6m-uwbyp-mx2iq-fr7nc-vbnhd-cxrkh-fpgvx-7xzo5-3ae"));

    console.log(f, 44);
  } catch (e) {
    console.log(e);
  }
});

import assert from 'assert';
import { Command } from 'commander';

import {
  generatePassword,
  etlFirebaseCreateNewUser,
  etlFirebaseCreateNewUserRecord,
  etlFirebaseDeleteUser,
  makeFirebaseClient,
} from 'wya-api';
import { ServiceAccount } from 'firebase-admin';

const firebase = new Command('firebase');

// Options
firebase.option('-P, --production', 'Execute in production environment');

/** Create New User */
firebase
  .command('create-new-user <email> [password]')
  .alias('cnu')
  .description('Create a new user')
  .action(async (email, password) => {
    assert(email);

    if (!password) {
      password = generatePassword();
    }
    assert(password);

    try {
      // Create firebase client
      const { production } = firebase.opts();
      const firebaseClient = makeFirebaseClient(
        JSON.parse(
          production
            ? `${process.env.FIREBASE_PRODUCTION_SERVICE_ACCOUNT}`
            : `${process.env.FIREBASE_DEVELOPMENT_SERVICE_ACCOUNT}`
        ) as ServiceAccount
      );

      // Create the user
      const {
        data: [uid],
      } = await etlFirebaseCreateNewUser(
        { email, password },
        { firebase: firebaseClient }
      );

      // Create the user record
      await etlFirebaseCreateNewUserRecord(
        {
          uid,
          email,
        },
        { firebase: firebaseClient }
      );

      console.log(
        `Generated new user ${uid} email: ${email} | password: ${password}`
      );
    } catch (err) {
      console.error(err);
    }
  });

/** Delete User */
firebase
  .command('delete-user <uid>')
  .alias('du')
  .description('Delete existing user')
  .action(async (uid) => {
    assert(uid);

    try {
      // Create firebase client
      const { production } = firebase.opts();
      const firebaseClient = makeFirebaseClient(
        JSON.stringify(
          production
            ? process.env.FIREBASE_PRODUCTION_SERVICE_ACCOUNT
            : process.env.FIREBASE_DEVELOPMENT_SERVICE_ACCOUNT
        )
      );

      await etlFirebaseDeleteUser({ uid }, { firebase: firebaseClient });

      console.log(`Deleted user: ${uid}`);
    } catch (err) {
      console.error(err);
    }
  });

export default firebase;

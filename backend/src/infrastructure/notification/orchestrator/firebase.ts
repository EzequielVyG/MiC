import * as admin from 'firebase-admin';

class FirebaseAdminSingleton {
  private static instance: FirebaseAdminSingleton;
  private adminInstance: admin.app.App;

  private constructor() {
    // Inicializa Firebase Admin SDK con las credenciales adecuadas
    this.adminInstance = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "mapa-interactivo-cultural",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjVKAVMDYR2jl2\nMyxxBbCEd25N1t8vu7pS8b182hCLsOGniA4p2GuhIkvtRRx1jBc9wAmKpZv8LbSd\nutfYE4Os9hJyFiHu0itQaA6RfNInVJDRXTzM+t6wFaBLAZSJ4m2ucjGDxFuLiLar\nmQCmfokr9EWhIjKBeSVG+KbJDk4Lll4h5K8jJDOkupDtneN+baxN/2C4knabNGs+\nVQIC8KWVhZxkl5wP24JvJcyidIVRfKfj7CsjdEAP7XGdsgvsaUhS1BqjErq3s2KT\nZ+TEuqn0yT2MwEzRDAH86W5fp+catDoJVYVj53kHIaQYyMrVGNqStFB1p1BXTkhA\nJc00wmSBAgMBAAECggEAAbl/Bzo/F+kp+imIKplYx81LCN9f8+0ThpSu34ad7hus\nBkzVeXOjj0wBaTv1lPgptqk0cJZXE06YPaIfbVSna0gd4b6CFTd65ZpzrO2YennW\nHZ/SaIetmkZgLuqRWvNdHR5vj2ifXtXOt/khnKBxalll8tGdnuhckGdHu4+/Gzgy\n6I9p5PLBkCYWOJlM4wDVe7bXf9ea867ZVKkT4hEWLg+jFAG89ubB1VV8AKOTBrij\n8+I0uB4cBneVj335m4nMB2DjyX09sfpaYzReiDQSEI0f5G7ib/GtcOwXdNiKeFJQ\nyTv5cHJhPnWKFRfLkEn94tq0YryJ1YC7sONRIa/70QKBgQDfIogfBYvQZhoelCf0\nULGayt+p7ZNr/Qc8+5hW7Qh8B4eLJP0o7EwR9+uC2qgzOwRY75Jc1FVDvNt92U6n\n712qW4TPquqeS0m5gLfZ6m6ICXbhOsaXMWvJlmXehKPrAkPmfW1F2t5MAW1cre/+\nxGzTjorBTDx+6sIJPoP+2m2alwKBgQC7YyB2012/ZTryGIckVogYtVDWWt1z8dtr\nHNoQBsAeCCQesrkqZMXrQLqIoAA8hZNvUMcV9UnYmMODpXwjzG7r9X15cR4N6iza\nzxQGM5m4oCdIgcfQsVcy/9fEx8eRO6mgqTile8jrmiGU3w3Tbs1B5N5fRqu3g0ZB\nXb6ngd9UpwKBgAsYkYJRaUl8ulHI9k+s75gN/J9bpBgbpg9/R20TLnfUfAYMWdZ+\nIa5HENwZ+YFKrwWpLDMXkAHlU1jnxISPX64IDQuyqSYkAk+KOhpJESQMrG+414VP\nPNfydbBiEjCulSfSFuwBXUqUS5bvQ17875h5nybLnrqE/A8vn6q9u/OTAoGACIJX\n1w2CFE7kflneySekxnp1UUaPB9TTweltfYzQ7IwyF7LF9cbdtfEah1m8qQLnzwY8\nBCM/VzaYqkG5gWanIs/jAsDAPKGFp+n/Xsi5Ekkzf3dlO3TSIN69TZJE3bN34HPO\nvrUASrKVE82NMyy05WkfL/Rll8++QPmgzrp3CcECgYEArY0HV3p2hpoHug+o/lPM\nVhm26ATsm0aT7rXobC+4ZNpy1s9B8XUJPvr8g5stK6uPr8gMaMv7PvUrvC0wgCLE\nzP01Nw8V2YzdH29Qn9+BrKA4hQh8/Aj+KVs22UOdLrIuwdw2R7i9xDwA+Tyc0CVi\nO1TtKcG0MTxtN9ot8uIL3yE=\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-3jueq@mapa-interactivo-cultural.iam.gserviceaccount.com",
      }),
      // Otras configuraciones aquí
    });
  }

  public static getInstance(): FirebaseAdminSingleton {
    if (!FirebaseAdminSingleton.instance) {
      FirebaseAdminSingleton.instance = new FirebaseAdminSingleton();
    }
    return FirebaseAdminSingleton.instance;
  }

  public getAdminInstance(): admin.app.App {
    return this.adminInstance;
  }
}

export default FirebaseAdminSingleton;
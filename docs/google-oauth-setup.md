# Google OAuth Setup for astr

## Step 1: OAuth Consent Screen

In Google Cloud Console (https://console.cloud.google.com) with the "astr" project selected:

```
Left sidebar: OAuth consent screen
```

```
+-----------------------------------------------+
|  OAuth consent screen                          |
|                                                |
|  User Type:                                    |
|  ( ) Internal                                  |
|  (x) External    <-- SELECT THIS               |
|                                                |
|  [CREATE]                                      |
+-----------------------------------------------+
```

### Fill in the form:

```
+-----------------------------------------------+
|  App information                               |
|                                                |
|  App name:        [ astr                     ] |
|  User support     [ your-email@gmail.com     ] |
|  email:                                        |
|                                                |
|  App logo:        (skip)                       |
|  App domain:      (skip)                       |
|                                                |
|  Developer        [ your-email@gmail.com     ] |
|  contact email:                                |
|                                                |
|  [SAVE AND CONTINUE]                           |
+-----------------------------------------------+
```

### Scopes page:
```
+-----------------------------------------------+
|  Scopes                                        |
|                                                |
|  (don't add anything, just click)              |
|                                                |
|  [SAVE AND CONTINUE]                           |
+-----------------------------------------------+
```

### Test users page:
```
+-----------------------------------------------+
|  Test users                                    |
|                                                |
|  (don't add anything, just click)              |
|                                                |
|  [SAVE AND CONTINUE]                           |
+-----------------------------------------------+
```

### Summary page:
```
+-----------------------------------------------+
|  Summary                                       |
|                                                |
|  [BACK TO DASHBOARD]                           |
+-----------------------------------------------+
```

---

## Step 2: Create OAuth Client ID

```
Left sidebar: Credentials
```

```
+-----------------------------------------------+
|  Credentials                                   |
|                                                |
|  [+ Create credentials v]                      |
|     |                                          |
|     |  API key                                 |
|     |  OAuth client ID    <-- CLICK THIS       |
|     |  Service account key                     |
+-----------------------------------------------+
```

### Application type:
```
+-----------------------------------------------+
|  Create OAuth client ID                        |
|                                                |
|  Application type:                             |
|  [ Web application v ]   <-- SELECT THIS       |
|                                                |
|  Name:                                         |
|  [ astr web                                  ] |
+-----------------------------------------------+
```

### Authorized JavaScript origins:

Click "+ ADD URI" twice and enter these two values:

```
+-----------------------------------------------+
|  Authorized JavaScript origins                 |
|                                                |
|  URIs 1:                                       |
|  [ http://localhost:3000                     ] |
|                                                |
|  URIs 2:                                       |
|  [ https://cosmic-connections-nine.vercel.app] |
|                                                |
|  [+ ADD URI]                                   |
+-----------------------------------------------+
```

### Authorized redirect URIs:

Click "+ ADD URI" twice and enter these two values:

```
+-----------------------------------------------+
|  Authorized redirect URIs                      |
|                                                |
|  URIs 1:                                       |
|  [ http://localhost:3000/api/auth/callback/google          ] |
|                                                |
|  URIs 2:                                       |
|  [ https://cosmic-connections-nine.vercel.app/api/auth/callback/google ] |
|                                                |
|  [+ ADD URI]                                   |
+-----------------------------------------------+
```

### Create:
```
+-----------------------------------------------+
|                                                |
|  [CREATE]          <-- CLICK THIS              |
|                                                |
+-----------------------------------------------+
```

---

## Step 3: Copy credentials

A popup will appear:

```
+-----------------------------------------------+
|  OAuth client created                          |
|                                                |
|  Your Client ID:                               |
|  xxxxxxxxxxxxxx.apps.googleusercontent.com     |
|                                                |
|  Your Client Secret:                           |
|  GOCSPX-xxxxxxxxxxxxxxxxxxxxxxx               |
|                                                |
|  [OK]                                          |
+-----------------------------------------------+
```

**Copy both values and paste them to me.**
I will update .env.local and Vercel for you.

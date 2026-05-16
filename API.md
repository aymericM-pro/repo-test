# API Reference

Base URL : `http://localhost:3000`

Toutes les routes sauf `Auth` nécessitent un header :
```
Authorization: Bearer <token>
```

---

## Auth

Routes publiques — pas de token requis.

### `POST /api/auth/register`

Crée un compte et retourne un JWT.

**Body**
```json
{
  "email": "john@example.com",       
  "username": "johndoe",             
  "password": "secret123"
}
```

**Réponse `201`**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "email": "...", "username": "...", "createdAt": "..." }
}
```

**Erreurs** : `409` email déjà utilisé.

---

### `POST /api/auth/login`

Authentifie un utilisateur et retourne un JWT.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Réponse `200`**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "email": "...", "username": "...", "createdAt": "..." }
}
```

**Erreurs** : `401` credentials invalides.

---

## Users

🔒 Toutes les routes nécessitent un token.

### `GET /api/users`

Retourne tous les utilisateurs.

**Réponse `200`** : tableau de `UserResponseDto`
```json
[{ "id": "uuid", "email": "...", "username": "...", "createdAt": "..." }]
```

---

### `GET /api/users/:userId`

Retourne un utilisateur par son ID.

**Params** : `userId` — UUID

**Réponse `200`** : `UserResponseDto`

**Erreurs** : `404` utilisateur introuvable.

---

### `POST /api/users`

Crée un utilisateur (sans login automatique, contrairement à `/api/auth/register`).

**Body**
```json
{
  "email": "john@example.com",
  "username": "johndoe",
  "password": "secret123"
}
```

**Réponse `200`** : `UserResponseDto`

**Erreurs** : `409` email déjà utilisé.

---

### `PUT /api/users/:userId`

Met à jour un utilisateur.

**Params** : `userId` — UUID

**Body** (tous les champs optionnels)
```json
{
  "username": "nouveau_pseudo",   // string ≤ 50 chars
  "password": "newpassword123"    // string ≥ 8 chars
}
```

**Réponse `200`** : `UserResponseDto`

**Erreurs** : `404` utilisateur introuvable.

---

### `DELETE /api/users/:userId`

Supprime un utilisateur.

**Params** : `userId` — UUID

**Réponse `204`** : vide

**Erreurs** : `404` utilisateur introuvable.

---

## Games

🔒 Toutes les routes nécessitent un token.

### `GameResponseDto` — structure commune aux réponses

```json
{
  "id": "uuid",
  "whiteId": "uuid",
  "blackId": "uuid | null",
  "status": "waiting | active | finished",
  "result": "white | black | draw | null",
  "endReason": "checkmate | resignation | timeout | draw_agreement | stalemate | abandoned | null",
  "timeControl": "bullet | blitz | rapid | classical",
  "timeLimit": 300,
  "increment": 3,
  "whiteTimeLeft": 300,
  "blackTimeLeft": 300,
  "moves": [],
  "currentTurn": "white | black",
  "moveCount": 0,
  "drawOfferedBy": "uuid | null",
  "lastMoveAt": "date | null",
  "startedAt": "date | null",
  "finishedAt": "date | null",
  "createdAt": "date"
}
```

---

### `GET /api/games`

Retourne toutes les parties.

**Réponse `200`** : tableau de `GameResponseDto`

---

### `GET /api/games/:id`

Retourne une partie par son ID.

**Params** : `id` — UUID

**Réponse `200`** : `GameResponseDto`

**Erreurs** : `404` partie introuvable.

---

### `GET /api/games/:id/report`

Génère un rapport PDF de la partie : infos générales, résultat, historique complet des coups avec le temps restant.

**Params** : `id` — UUID

**Réponse `200`** : fichier `application/pdf`

**Erreurs** : `404` partie introuvable.

---

### `POST /api/games`

Crée une nouvelle partie. L'utilisateur connecté joue les blancs. La partie démarre en statut `waiting` jusqu'à ce qu'un adversaire rejoigne.

**Body**
```json
{
  "timeControl": "blitz",   // "bullet" | "blitz" | "rapid" | "classical", requis
  "timeLimit": 300,         // durée en secondes par joueur, entier > 0, requis
  "increment": 3,           // secondes ajoutées par coup, entier ≥ 0, requis
  "playerId": "uuid"        // UUID du joueur IA adverse, optionnel
}
```

**Réponse `200`** : `GameResponseDto` (status: `waiting`)

---

### `POST /api/games/:id/simulate`

Joue automatiquement une partie complète depuis le statut `waiting`. L'utilisateur connecté incarne les noirs. Exécute le Scholar's Mate (7 demi-coups, victoire des blancs par échec et mat).

**Params** : `id` — UUID

**Pré-condition** : la partie doit être en statut `waiting`.

**Réponse `200`** : `GameResponseDto` (status: `finished`, result: `white`, endReason: `checkmate`)

**Erreurs** : `404` introuvable, `409` partie déjà commencée.

---

### `POST /api/games/:id/resign`

Abandonne la partie. Le joueur connecté perd.

**Params** : `id` — UUID

**Pré-condition** : la partie doit être en statut `active`.

**Réponse `200`** : `GameResponseDto` (status: `finished`, endReason: `resignation`)

**Erreurs** : `404` introuvable, `409` partie déjà terminée, `403` pas dans cette partie.

---

### `POST /api/games/:id/draw`

Propose la nulle à l'adversaire. Met à jour `drawOfferedBy` avec l'ID du joueur.

**Params** : `id` — UUID

**Pré-condition** : partie `active`, aucune offre de nulle déjà en cours.

**Réponse `200`** : `GameResponseDto` (`drawOfferedBy` renseigné)

**Erreurs** : `404` introuvable, `409` partie terminée ou offre déjà en cours, `403` pas dans cette partie.

---

### `POST /api/games/:id/draw/accept`

Accepte l'offre de nulle de l'adversaire. Termine la partie.

**Params** : `id` — UUID

**Pré-condition** : partie `active`, une offre doit exister ET venir de l'autre joueur.

**Réponse `200`** : `GameResponseDto` (status: `finished`, result: `draw`, endReason: `draw_agreement`)

**Erreurs** : `404` introuvable, `409` aucune offre en cours, `403` pas dans cette partie.

---

### `POST /api/games/:id/draw/decline`

Refuse l'offre de nulle. Efface `drawOfferedBy`, la partie continue.

**Params** : `id` — UUID

**Pré-condition** : partie `active`, une offre doit exister ET venir de l'autre joueur.

**Réponse `200`** : `GameResponseDto` (`drawOfferedBy` remis à `null`)

**Erreurs** : `404` introuvable, `409` aucune offre en cours, `403` pas dans cette partie.

---

## Players

🔒 Toutes les routes nécessitent un token.

### `PlayerResponseDto` — structure commune aux réponses

```json
{
  "id": "uuid",
  "username": "stockfish",
  "elo": 1200,
  "rating": "beginner",
  "createdAt": "date"
}
```

---

### `GET /api/players/:playerId`

Retourne un joueur IA par son ID.

**Params** : `playerId` — UUID

**Réponse `200`** : `PlayerResponseDto`

**Erreurs** : `404` joueur introuvable.

---

### `POST /api/players`

Crée un joueur IA.

**Body**
```json
{
  "username": "stockfish",   // string ≤ 50 chars, requis
  "elo": 1200,               // entier > 0, optionnel (défaut : 1200)
  "rating": "beginner"       // string ≤ 50 chars, optionnel (défaut : "beginner")
}
```

**Réponse `201`** : `PlayerResponseDto`

---

### `POST /api/players/:playerId/games`

Crée une partie contre un joueur IA. L'utilisateur connecté joue les blancs.

**Params** : `playerId` — UUID

**Body** : même structure que `POST /api/games`

**Réponse `200`** : `GameResponseDto` (status: `waiting`)

**Erreurs** : `404` joueur introuvable.

---

## Codes d'erreur globaux

| Code HTTP | Signification |
|-----------|---------------|
| `400` | Body invalide (validation class-validator) |
| `401` | Token manquant, invalide ou expiré |
| `403` | Action non autorisée pour cet utilisateur |
| `404` | Ressource introuvable |
| `409` | Conflit d'état (déjà existant, partie terminée, etc.) |
| `422` | Coup invalide |
| `500` | Erreur serveur interne |

Toutes les erreurs suivent le format :
```json
{
  "requestId": "uuid",
  "timestamp": "ISO date",
  "path": "/api/...",
  "message": "description de l'erreur"
}
```

# ImpactRadar — Diagramme interactif Build → Handover → FM

## Objectif

Composant visuel pour Stoffice qui montre aux clients Dalux l'impact financier d'un bon remplissage Handover sur le FM. Le client active des catégories de données et voit les économies CHF en temps réel.

## Architecture

- **Composant** : `src/components/ImpactRadar.tsx` — composant React client-side
- **Rendu** : Canvas 2D pour les rayons animés + particules, HTML/CSS pour le reste
- **Placement** : Page d'accueil (`page.tsx`), entre le hero et le calculateur ROI
- **i18n** : DE/FR via le système `t()` existant

## Design visuel

### Structure circulaire
- 3 anneaux concentriques : **Build** (extérieur, bleu), **Handover** (milieu, violet), **FM** (intérieur, vert)
- Au centre : montant CHF total d'économies, animé

### 4 catégories de données (rayons)
| Catégorie | Couleur | Économie estimée |
|-----------|---------|-----------------|
| Assets / Équipements | `#00d4aa` (accent) | CHF 95'000 |
| Documents / Plans | `#60a5fa` (info) | CHF 18'000 |
| Garanties / Contrats | `#a87ad4` (plum) | CHF 32'000 |
| Historique Snags | `#d4a843` (gold) | CHF 22'000 |

### Interactions
- 4 boutons autour du cercle, un par catégorie
- Click = toggle ON/OFF
- ON : rayon coloré apparaît du bord vers le centre, particules animées coulent, chip stats s'allume
- OFF : rayon disparaît, particules s'arrêtent
- Le CHF au centre s'anime (compteur fluide) à chaque toggle
- L'anneau FM pulse quand au moins un rayon est actif

### Responsive
- Desktop : 520px de diamètre, boutons autour
- Mobile : 320px de diamètre, boutons en ligne sous le radar

## Données

Toutes statiques (pas d'API). Les montants reflètent des estimations réalistes basées sur les valeurs par défaut du calculateur (250 jours, 30 incidents/jour, 48 min, CHF 85/h = CHF 510'000 de coûts annuels).

## Section contextuelle

Titre au-dessus du radar : "Pourquoi le Handover est critique" (DE: "Warum das Handover entscheidend ist")
Sous-titre : "Chaque donnée correctement transférée économise de l'argent en FM"

## Intégration i18n

Ajouter les clés suivantes dans `src/lib/i18n.ts` pour DE et FR :
- `radarTitle`, `radarSubtitle`
- `radarAssets`, `radarDocs`, `radarGaranties`, `radarSnags`
- `radarSavingsLabel`, `radarPerYear`
- `radarInstruction`

## Scope

- Un seul composant `ImpactRadar.tsx`
- Mises à jour de `page.tsx` (placement) et `i18n.ts` (traductions)
- Pas de nouvelles dépendances npm
- Canvas 2D natif pour les animations (pas de lib externe)

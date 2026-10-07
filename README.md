# Мої улюблені місця на карті — React Native Day 10

Домашнє завдання: карти та геолокація в Expo (`expo-location` + `react-native-maps` + Expo Router).

## Запуск

```bash
npm install
npx expo start
```

Відскануйте QR-код в **Expo Go** (iOS — Apple Maps, Android — Google Maps).

## Що реалізовано

### Завдання 1 — `src/hooks/useLocationPermission.ts`
- `checkPermission` — `getForegroundPermissionsAsync()`; якщо `canAskAgain === false` і дозвіл не надано → `'denied'`, інакше системний статус мапиться у `'granted' | 'denied' | 'undetermined'`.
- `requestPermission` — ставить `'loading'`, викликає `requestForegroundPermissionsAsync()`, оновлює статус і повертає `true/false`.

### Завдання 2 — `src/hooks/useCurrentLocation.ts`
- `fetchLocation` — `getCurrentPositionAsync({ accuracy: Accuracy.Balanced })`, зберігає `latitude/longitude`, помилку пише в `error`, `loading` вимикається у `finally`.

### Завдання 3 — `app/index.tsx`
- **3.1** Підписка на `AppState`: при поверненні в застосунок (`'active'`) статус дозволу перевіряється повторно — після увімкнення доступу в Налаштуваннях екран одразу показує карту. Підписка знімається в cleanup.
- **3.2** Після отримання дозволу автоматично запитуються координати.
- **3.3** При нових координатах камера анімовано центрується (`animateToRegion`, 800 мс, delta 0.01).
- **3.4** Тап по карті додає мітку `Місце #N` з часом створення. Тапи по маркерах (`action === 'marker-press'` на Android) ігноруються, щоб не створювати зайвих міток.
- **3.5** Тап по `Callout` мітки видаляє її.
- **3.6** Кнопка 🎯 центрує камеру на користувачі; якщо координат ще немає — повторно запитує їх.

Додатково: оновлення стану через функціональний `setPins(prev => ...)` (без застарілих замикань), повідомлення в бейджі, якщо геопозицію не вдалося визначити.

## Структура

```text
app/
  _layout.tsx                  # кореневий Stack
  index.tsx                    # екран карти
src/
  hooks/useLocationPermission.ts
  hooks/useCurrentLocation.ts
  components/LocationPermissionRequest.tsx
  components/LocationDenied.tsx
  components/UserMarker.tsx
  components/PlaceMarker.tsx
  types/map.ts
```

## Перевірка

- `npx tsc --noEmit` — без помилок
- `npx expo-doctor` — 21/21 перевірок пройдено
- `npx expo export --platform android` — бандл збирається

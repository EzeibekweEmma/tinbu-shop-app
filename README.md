# Duplicate Name Finder

Duplicate Name Finder is a React Native app that helps you find duplicate names from a comma-separated list. It normalizes the names by converting them to lowercase and returns groups of names that are duplicates.

## Features

- **Real-Time Duplicate Detection:** Enter a list of names, and the app will immediately show groups of duplicates.
- **Normalization:** Compares names case-insensitively, ensuring `John` and `john` are considered duplicates.
- **User-Friendly Interface:** Simple text input and easy-to-read output.

## Screenshots
<!--  -->
![Screenshot](https://via.placeholder.com/300x500) <!-- Replace with actual screenshot URL -->

## Installation

To run this app locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone 
   cd duplicate-name-finder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Run the app:**
   ```bash
   npx expo start
   ```

   This will start the Expo development server. You can then use the Expo Go app on your phone or an emulator to see the app in action.

## Usage

1. **Launch the app.**
2. **Enter a comma-separated list of names** into the text input field.
3. **Press the "Separate" button.** The app will display groups of duplicate names below the input field.

### Example

**Input:**
```
John, JOHN, joy, JOHn, Peter, JOY, tosin, PeTER
```

**Output:**
```
John, JOHN, JOHn
joy, JOY
Peter, PeTER
```

## Code Overview

The core logic of the app is in the `findDuplicateNames` function, which groups names by their lowercase forms and returns only the groups with more than one name.

```typescript
const findDuplicateNames = (names: string[]) => {
  const nameGroups: { [key: string]: string[] } = {};

  names.forEach((name) => {
    const lowerCaseName = name.toLowerCase();
    if (nameGroups[lowerCaseName]) {
      nameGroups[lowerCaseName].push(name);
    } else {
      nameGroups[lowerCaseName] = [name];
    }
  });

  return Object.values(nameGroups).filter((group) => group.length > 1);
};
```

## Technologies Used

- **React Native:** Framework for building native apps using React.
- **TypeScript:** For type safety and better developer experience.
- **Expo:** For easier development and testing.

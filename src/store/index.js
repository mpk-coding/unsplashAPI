import {createSlice, configureStore} from "@reduxjs/toolkit";

const getLocal = () => {
  return JSON.parse(localStorage.getItem("myUnsplash"));
};

const init = () => {
  let local = getLocal();
  let initialState;
  if (local !== null) {
    initialState = local;
  } else {
    initialState = [
      {query: ""},
      {active: "all"},
      {name: "Random"},
      {name: "all", savedPhotos: []},
      {name: "customFolder", savedPhotos: []},
    ];
  }
  return initialState;
};

export const userFolderSlice = createSlice({
  name: "userFolders",
  initialState: init(),
  reducers: {
    add: (state, action) => {
      state.push({name: action.payload, savedPhotos: []});
      return state;
    },
    activate: (state, action) => {
      const key = action.payload;
      let index;
      for (const entry of state) {
        if (entry.name === key) {
          index = state.indexOf(entry);
        }
      }

      //  Cthulhu code
      state[
        state.indexOf(
          state.find((el) => {
            return Object.keys(el).includes("active");
          })
        )
      ].active = state[index].name;
      return state;
    },
    inactivate: (state) => {},
    reset: (state, action) => {
      console.log("CHANGE THE GOD DAMN FUCKING STATE");
      state = init();
    },
    get: (state) => {
      return state;
    },
    update: (state, action) => {
      for (const checkedBox of action.payload.checked) {
        let toChange = state.find((correspondingFolderName) => {
          return Object.values(correspondingFolderName).includes(checkedBox);
        });
        toChange.savedPhotos.push(action.payload.photo);
      }
      let all = state.find((element) => {
        return Object.values(element).includes("all");
      });
      all.savedPhotos.push(action.payload.photo);
      return state;
    },
    search: (state, action) => {
      state[
        state.indexOf(
          state.find((el) => {
            return Object.keys(el).includes("active");
          })
        )
      ].active = "search";

      state[
        state.indexOf(
          state.find((el) => {
            return Object.keys(el).includes("query");
          })
        )
      ].query = action.payload;
      return state;
    },
  },
});

const store = configureStore({
  reducer: {
    userFolder: userFolderSlice.reducer,
  },
});

export const userFolderSliceActions = userFolderSlice.actions;
export default store;

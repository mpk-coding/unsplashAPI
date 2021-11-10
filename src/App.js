import {useSelector} from "react-redux";
import {useEffect} from "react";

import {createApi} from "unsplash-js";

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import UserFolderTabs from "./components/UserFolder/UserFolderTabs";
import PhotoContainer from "./components/Photo/PhotoContainer";

const endpoint = "https://api.unsplash.com/";
const key = "DIPc23XibXAcYqP2g6VyQ3RrHgJNwo2a_X0PvssNgAA";
const unsplash = createApi({
  apiUrl: endpoint,
  accessKey: key,
});

function App() {
  const data = useSelector((state) => {
    return state.userFolder;
  });
  useEffect(() => {
    localStorage.setItem("myUnsplash", JSON.stringify(data));
  }, []);

  const isActive =
    data[
      data.indexOf(
        data.find((el) => {
          return Object.keys(el).includes("active");
        })
      )
    ].active;

  //  don't have a better idea
  //  so as not to hold each folder and it's savedPhotos in memory
  //  I get only that of the active folder right here and pass the function
  const getSavedPhotos = () => {
    let local = JSON.parse(localStorage.getItem("myUnsplash"));
    if (local) {
      const [filtered] = local.filter((element) => {
        return element.name === isActive;
      });
      if (filtered) {
        return filtered.savedPhotos ? filtered.savedPhotos : filtered;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const getQuery = () => {
    return data[
      data.indexOf(
        data.find((el) => {
          return Object.keys(el).includes("query");
        })
      )
    ].query;
  };

  return (
    <div className="App">
      <header>
        <UserFolderTabs folders={data} isActive={isActive}></UserFolderTabs>
      </header>
      <main>
        <PhotoContainer
          getQuery={getQuery}
          isActive={isActive}
          unsplash={unsplash}
          getPhotos={getSavedPhotos}
        ></PhotoContainer>
      </main>
    </div>
  );
}

export default App;

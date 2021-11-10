import ReactDOM from "react-dom";
import {Fragment, useReducer, useEffect, useState} from "react";
import {Image, Modal, Button, Form} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {v4 as uuid} from "uuid";

import AddPhoto from "./AddPhoto";

import style from "./Photo.module.css";

import {userFolderSliceActions} from "../../store";

const setPhotoData = (state, action) => {
  switch (action.type) {
    case "images-loaded":
      return {
        username: action.image.user.name,
        src: action.image.urls.raw,
      };
    default:
      throw new Error();
  }
};

const Photo = (props) => {
  const state = useSelector((state) => {
    return state.userFolder;
  });
  const dispatch = useDispatch();
  const [photoData, dispatchPhotoData] = useReducer(setPhotoData, {
    username: "",
    src: "",
  });
  const [isModal, setIsModal] = useState(false);
  const [savePhoto, setSavePhoto] = useState();
  const [formState, setFormState] = useState([]);

  useEffect(
    (prevState) => {
      if (prevState !== props.data) {
        dispatchPhotoData({type: "images-loaded", image: props.data});
      }
    },
    [props.data]
  );

  const onAddPhotoHandler = (photo) => {
    setSavePhoto(photo);
    setIsModal(true);
  };

  const modalCloseHandler = (event) => {
    setIsModal(false);
  };

  const inputChangeHandler = (event) => {
    setFormState((prevState) => {});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const pkg = {
      checked: [],
      photo: {},
    };
    pkg.photo = savePhoto;
    for (let input of event.target) {
      if (input.nodeName === "INPUT") {
        input.checked && pkg.checked.push(input.nextSibling.innerHTML);
      }
    }
    if (pkg.checked.length > 0) {
      return dispatch(userFolderSliceActions.update(pkg));
    }
  };

  return (
    <Fragment>
      <div className={style.photo}>
        <div className={style.overlay}>
          <AddPhoto addPhoto={onAddPhotoHandler} data={props.data} />
          <span className={style.text}>Author: {photoData.username}</span>
        </div>
        <Image className={style.img} fluid src={photoData.src} alt="" />
      </div>
      {isModal &&
        ReactDOM.createPortal(
          <Modal show={isModal} onHide={modalCloseHandler} backdrop="static">
            <Modal.Header>
              <Modal.Title>Where do you want to save the photo?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form id={"add-photo-form"} onSubmit={submitHandler}>
                {state.map((folder) => {
                  return (
                    folder.name &&
                    !folder.name.includes("Random") &&
                    !folder.name.includes("all") && (
                      <div key={uuid()} className="mb-3">
                        <Form.Check
                          onChange={inputChangeHandler}
                          key={uuid()}
                          type="checkbox"
                          id={folder.name}
                          label={folder.name}
                        />
                      </div>
                    )
                  );
                })}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={modalCloseHandler}>
                Cancel
              </Button>
              <Button type="submit" form={"add-photo-form"}>
                Save photo
              </Button>
            </Modal.Footer>
          </Modal>,
          document.querySelector("#root-modal")
        )}
    </Fragment>
  );
};

export default Photo;

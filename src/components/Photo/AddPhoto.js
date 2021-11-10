import {Button} from "react-bootstrap";

import style from "./AddPhoto.module.css";

const AddPhoto = (props) => {
  const onClickHandler = (event) => {
    props.addPhoto(props.data);
  };
  
  return (
    <Button className={style.AddPhoto} onClick={onClickHandler}>
      +
    </Button>
  );
};

export default AddPhoto;

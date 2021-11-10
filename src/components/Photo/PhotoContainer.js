import Photo from "./Photo";
import {Alert, Container, Row, Col} from "react-bootstrap";

import {v4 as uuid} from "uuid";
import {useEffect, useState} from "react";

import style from "./PhotoContainer.module.css";

const PhotoContainer = (props) => {
  const [data, setData] = useState(props.getPhotos());
  const unsplash = props.unsplash;
  const isActive = props.isActive;

  useEffect(() => {
    if (isActive === "Random") {
      unsplash.photos.list({page: 1, perPage: 24}).then((result) => {
        return setData(result.response.results);
      });
    }
    if (isActive === "search") {
      let query = props.getQuery();

      unsplash.search
        .getPhotos({
          query: query,
          page: 1,
          perPage: 24,
        })
        .then((result) => {
          return setData(result.response.results);
        });
    }
    setData(props.getPhotos());
  }, [isActive, props, unsplash]);

  return (
    <Container>
      <Row>
        {data.length > 0 && data[0] !== "test" ? (
          Array.from(data).map((photo) => {
            return (
              <Col className={style.col} key={uuid()}>
                <Photo key={uuid()} data={photo}></Photo>
              </Col>
            );
          })
        ) : (
          <Alert variant="info">Could not load any images!</Alert>
        )}
      </Row>
    </Container>
  );
};

export default PhotoContainer;

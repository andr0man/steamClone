import { useState, useRef, useEffect } from "react";

export const ImageCarousel = ({ title, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  // version toggles to force a re-render / re-run of getTranslateX after transitionend
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      const track = trackRef.current;
      if (track.children.length > 0) {
        setSlideWidth(track.children[0].offsetWidth);
      }
    }
  }, [images]);

  // Recalculate / force re-render after the track finishes its transition.
  // This ensures getTranslateX() is re-run after the visual slide change completes
  // (addresses the case where currentIndex updates before the slide is fully positioned).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onTransitionEnd = (e) => {
      // Only react to transitions on the track element (ignore inner transitions)
      if (e.target !== track) return;

      // If we're on the last slide (or generally after any slide move), re-measure
      // and bump `version` so getTranslateX() runs again with up-to-date layout.
      if (track.children.length > 0) {
        setSlideWidth(track.children[0].offsetWidth);
      }
      setVersion((v) => v + 1);
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [currentIndex, images]);

  const getTranslateX = () => {
    if (!trackRef.current || slideWidth === 0) return 0;

    const track = trackRef.current;
    console.log("track:", track.scrollWidth);

    const containerWidth = track.parentElement.offsetWidth;
    const allSlides = Array.from(track.children);

    // First slide: align left edge
    if (currentIndex === 0) {
      return 0;
    }

    // Last slide: align right edge
    if (currentIndex === images.length - 1) {
      const trackScrollWidth = track.scrollWidth;
      // Move so the right edge of the last slide aligns with the right edge of the container
      return -(trackScrollWidth - containerWidth);
    }

    // Other slides: center them
    const currentSlide = allSlides[currentIndex];
    const slideLeft = currentSlide.offsetLeft;
    const offset = slideLeft + slideWidth / 2 - containerWidth / 2;

    return -offset;
  };

  return (
    <>
      <div className="screenshots-title-and-buttons">
        <h3 className="h3-with-bottom-border">{title}</h3>
        <div className="screenshot-buttons">
          <button
            className="screenshots-left-button"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
          />
          <button
            className="screenshots-buttons"
            onClick={() =>
              setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1))
            }
            disabled={currentIndex === images.length - 1}
          />
        </div>
      </div>
      <div className="screenshots-carousel">
        {images.length > 0 ? (
          <div className="carousel-track-wrapper">
            <div
              ref={trackRef}
              className="carousel-track"
              style={{
                transform: `translateX(${getTranslateX()}px)`,
              }}
            >
              {images.map((screenshot, idx) => (
                <div
                  className={`carousel-slide ${
                    idx === currentIndex ? "active" : ""
                  }`}
                  key={idx}
                >
                  <img
                    src={screenshot}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span>No screenshots available</span>
        )}
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
          color: "#aaa",
          fontSize: "0.95em",
        }}
      >
        {images.length > 0 && (
          <span>
            {currentIndex + 1} / {images.length}
          </span>
        )}
      </div>
    </>
  );
};

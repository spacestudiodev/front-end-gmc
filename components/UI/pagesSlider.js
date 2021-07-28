import {useRef, useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";

const xOffset = 100;
const variants = {
    enter: (direction) => ({
        x: direction > 0 ? xOffset : -xOffset,
        opacity: 0
    }),
    active: {
        x: 0,
        opacity: 1,
        transition: {delay: 0.2}
    },
    exit: (direction) => ({
        x: direction > 0 ? -xOffset : xOffset,
        opacity: 0
    })
};

const PagesSlider = ({currentPage, setPage, direction, images}) => {
    const [_currentPage, setCurrentPage] = useState(currentPage)

    useEffect(() => {
        if (currentPage !== _currentPage) {
            setCurrentPage(currentPage)
        }
    }, [currentPage])

    const hasPaginated = useRef(false);
    const index = _currentPage

    const detectPaginationGesture = (e, {offset}) => {
        console.log(e)
        if (hasPaginated.current) return;
        let newPage = currentPage;
        const threshold = xOffset / 2;

        if (offset.x < -threshold) {
            // If user is dragging left, go forward a page
            newPage = currentPage + 1;
            if (newPage >= images.length) newPage = 0
        } else if (offset.x > threshold) {
            // Else if the user is dragging right, 
            // go backwards a page
            newPage = currentPage - 1;
            if (newPage < 0) newPage = images.length - 1
        }

        if (newPage !== currentPage) {
            hasPaginated.current = true;
            // Wrap the page index to within the 
            // permitted page range
            setPage(newPage, offset.x < 0 ? 1 : -1);
        }
    }
    return (
        <div className="slider-container">
            <AnimatePresence
                // This will be used for components to resolve
                // exit variants. It's neccessary as removed 
                // components won't rerender with 
                // the latest state (as they've been removed)
                custom={direction}>
                <motion.div
                    key={0}
                    className="slide"
                    data-page={_currentPage}
                    variants={variants}
                    initial="enter"
                    animate="active"
                    exit="exit"
                    drag="x"
                    onDrag={(e, v) => detectPaginationGesture(e, v)}
                    onDragStart={() => (hasPaginated.current = false)}
                    onDragEnd={() => (hasPaginated.current = true)}
                    // Snap the component back to the center
                    // if it hasn't paginated
                    dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
                    // This will be used for components to resolve all 
                    // other variants, in this case initial and animate.
                    custom={direction}
                />
            </AnimatePresence>
        </div>
    );
}

export default PagesSlider

import "./priceRange.css"
import { Stage, Layer, Circle, Rect, Text} from 'react-konva';
import { useRef, useState, useEffect } from "react";
import { formatNumber } from "../../utils/format";

export default function PriceRange({min, value, max}){
	const MIN_PROGRESS_WIDTH = 20;
	let pointerPosition = 0;
	if ((max - min)>0){
		pointerPosition=(value - min) / (max - min)
	}
	const divRef = useRef(null);
	const color = pointerPosition < 0.33 ? 'green' : pointerPosition < 0.66 ? 'yellow' : 'red';
    
	const [dimensions, setDimensions] = useState({
	    width: 0,
	    height: 0
	})

	//get height and width of container
	useEffect(() => {
		if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
			setDimensions({
				width: divRef.current.offsetWidth,
				height: divRef.current.offsetHeight
			})
		}
	}, [value, min, max])
	
	return (
		<div className="range-container" ref={divRef}>
			<Stage width={dimensions.width} height={dimensions.height}>
				<Layer>
					{/* Background bar */}
					<Rect
						x={dimensions.width * 0.05}
						y={dimensions.height / 2 - 4}
						width={dimensions.width * 0.9}
						height={8}
						fill="lightgray"
					/>

					{/* Pointer */}
					<Rect
						x={dimensions.width * 0.05 - 9}
						y={dimensions.height / 2 - 10}
						width={dimensions.width * pointerPosition  + MIN_PROGRESS_WIDTH}
						height={20}
						fill={color}
						cornerRadius={1000}
					/>

					{/* Circle for Min */}
					<Circle
						x={dimensions.width * 0.05}
						y={dimensions.height / 2}
						radius={10}
						fill="white"
					/>

					{/* Circle for Max */}
					<Circle
						x={dimensions.width * 0.95}
						y={dimensions.height / 2}
						radius={10}
						fill="white"
					/>
					</Layer>
			</Stage>

			{/* Min and Max Labels below the drawings */}
			<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingBottom:'3rem', height:'fit-content'}}>
				<span style={{ fontSize: '14px', color: 'black',  marginLeft: '1rem'}}>{"$ " + formatNumber(min)}</span>
				<span style={{ fontSize: '14px', color: 'black', textAlign: 'right', marginRight: '1rem'}}>{"$ " + formatNumber(max)}</span>
			</div>
        </div>
	);
}
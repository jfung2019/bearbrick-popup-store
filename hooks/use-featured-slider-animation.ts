// GSAP animation setup for the featured products slider
import { useEffect } from "react";
import gsap from "gsap";

export function useFeaturedSliderAnimation(sliderRef: React.RefObject<HTMLDivElement | null>) {
	useEffect(() => {
		if (!sliderRef.current) return;
		const cards = sliderRef.current.querySelectorAll(".featured-card");
		gsap.set(cards, { opacity: 0, y: 40 });
		gsap.to(cards, {
			opacity: 1,
			y: 0,
			duration: 0.7,
			stagger: 0.12,
			ease: "power3.out",
		});
	}, [sliderRef]);
}

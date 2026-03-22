import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.css"],
})
export class SliderComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slides = [
    {
      logo: "🩸",
      title: "Life Saving Blood Donation",
      description:
        "An end to end Solution for managing Blood Transfusion Center or Storage Unit.",
      bgColor: "#d32f2f",
    },
    {
      logo: "🏥",
      title: "User Friendly",
      description:
        "User friendly and configurable platform for all blood banks.",
      bgColor: "#c62828",
    },
    {
      logo: "✓",
      title: "NACO Guidelines",
      description:
        "Adhere to National Aids Control Organisation (NACO) Guidelines.",
      bgColor: "#b71c1c",
    },
  ];
  autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetAutoSlide();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  resetAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.startAutoSlide();
  }
}

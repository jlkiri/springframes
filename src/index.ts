const DISPL_THRESHOLD = 3;

/*
  Fspring + Fdamping = a * m
  a = (Fspring + Fdamping) / m
  a = (-k * x + d * v)  / m (where k = stiffness, d = damping ratio)
  Calculate next speed from acceleration: v2 = v1 + a * t
  Calculate next position from previous position and speed: p2 = p1 + v * t
*/

export type SpringParameters = {
  dx: number;
  dy: number;
  reverse?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export function createSpringAnimation({
  dx,
  dy,
  reverse = false,
  stiffness = 500,
  damping = 50,
  mass = 1,
}: SpringParameters) {
  const spring_length = 1;
  const k = -stiffness;
  const d = -damping;
  const frame_rate = 1 / 60;

  let x = dx;
  let y = dy;

  let velocity_x = 0;
  let velocity_y = 0;

  let keyframes = [];

  let frames = 0;
  let frames_below_threshold = 0;
  let largest_displ;

  for (let step = 0; step <= 1000; step += 1) {
    let Fspring_x = k * (x - spring_length);
    let Fspring_y = k * (y - spring_length);
    let Fdamping_x = d * velocity_x;
    let Fdamping_y = d * velocity_y;

    let accel_x = (Fspring_x + Fdamping_x) / mass;
    let accel_y = (Fspring_y + Fdamping_y) / mass;

    velocity_x += accel_x * frame_rate;
    velocity_y += accel_y * frame_rate;

    x += velocity_x * frame_rate;
    y += velocity_y * frame_rate;

    keyframes.push({
      transform: `translate(${x}px, ${y}px)`,
    });

    const xy = Math.sqrt(x ** 2 + y ** 2);

    // Save the last largest displacement so that we can compare it with threshold later
    largest_displ =
      largest_displ < 0
        ? Math.max(largest_displ || -Infinity, xy)
        : Math.min(largest_displ || Infinity, xy);

    if (Math.abs(largest_displ) < DISPL_THRESHOLD) {
      frames_below_threshold += 1;
    } else {
      frames_below_threshold = 0; // Reset the frame counter
    }

    if (frames_below_threshold >= 60) {
      console.debug(
        "Largest displacement over last 60 frames",
        `${Math.abs(largest_displ)}px`
      );
      frames = step;
      break;
    }
  }

  if (frames == 0) {
    frames = 1000;
  }

  console.debug(`Generated ${frames} frames`);

  return { keyframes: reverse ? keyframes.reverse() : keyframes, frames };
}

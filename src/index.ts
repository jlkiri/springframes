const DISPL_THRESHOLD = 2;

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
  deg?: number;
  scale?: number;
  reverse?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export type SpringFrames = {
  keyframes: Keyframe[];
  frames: number;
};

export function createSpringAnimation({
  dx,
  dy,
  deg = 0,
  scale = 1,
  reverse = false,
  stiffness = 500,
  damping = 4,
  mass = 1,
}: SpringParameters): SpringFrames {
  if (dx === 0 && dy === 0) return { keyframes: [], frames: 0 };

  const spring_length = 0;
  const k = -stiffness;
  const d = -damping;
  const frame_rate = 1 / 60;

  let x = dx;
  let y = dy;
  let r = deg;
  let s = scale - 1;

  let velocity_x = 0;
  let velocity_y = 0;
  let velocity_r = 0;
  let velocity_s = 0;

  let keyframes = [];

  let frames = 0;
  let frames_below_threshold = 0;
  let largest_displ;

  for (let step = 0; step <= 1000; step += 1) {
    let Fspring_x = k * (x - spring_length);
    let Fspring_y = k * (y - spring_length);
    let Fspring_r = k * (r - spring_length);
    let Fspring_s = k * (s - spring_length);
    let Fdamping_x = d * velocity_x;
    let Fdamping_y = d * velocity_y;
    let Fdamping_r = d * velocity_r;
    let Fdamping_s = d * velocity_s;

    let accel_x = (Fspring_x + Fdamping_x) / mass;
    let accel_y = (Fspring_y + Fdamping_y) / mass;
    let accel_r = (Fspring_r + Fdamping_r) / mass;
    let accel_s = (Fspring_s + Fdamping_s) / mass;

    velocity_x += accel_x * frame_rate;
    velocity_y += accel_y * frame_rate;
    velocity_r += accel_r * frame_rate;
    velocity_s += accel_s * frame_rate;

    x += velocity_x * frame_rate;
    y += velocity_y * frame_rate;
    r += velocity_r * frame_rate;
    s += velocity_s * frame_rate;

    keyframes.push({
      transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${
        s / scale + 1
      })`,
    });

    // Save the last largest displacement so that we can compare it with threshold later
    largest_displ =
      largest_displ < 0
        ? Math.max(largest_displ || -Infinity, Math.sqrt(x ** 2 + y ** 2))
        : Math.min(largest_displ || Infinity, Math.sqrt(x ** 2 + y ** 2));

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

  if (!reverse) {
    keyframes.push({
      transform: `translate(0px, 0px) rotate(0deg) scale(1)`,
    });
  }

  const finalKeyframes = reverse ? keyframes.reverse() : keyframes;

  if (reverse) {
    keyframes.unshift({
      transform: `translate(0px, 0px) rotate(0deg) scale(1)`,
    });
  }

  console.debug(`Generated ${frames} frames`);

  return { keyframes: finalKeyframes, frames };
}

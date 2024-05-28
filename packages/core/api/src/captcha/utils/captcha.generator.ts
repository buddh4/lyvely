import { registerFont, createCanvas } from 'canvas';
import { randomInt } from 'crypto';
import { resolve } from 'path';

registerFont(resolve(__dirname, './PunctureRegular.ttf'), { family: 'PunctureRegular' });

interface ICaptchaOptions {
  font?: string;
  fontSize?: string;
  width?: number;
  height?: number;
  length?: number;
  token?: string;
  particles?: number;
  theme?: 'dark' | 'light';
}

const DEFAULT_LENGTH = 5;

const DEFAULT_OPTIONS = {
  font: 'PunctureRegular',
  fontSize: '65pt',
  theme: 'light',
  width: 430,
  particles: 100,
  height: 130,
  length: DEFAULT_LENGTH,
} as ICaptchaOptions;

// g was too similar to 9 with PunctureRegular font
const DEFAULT_CAPTCHA_CHARS = 'abcdefhijklmnopqrstuvwxyz123456789';

const PARTICLE_COLORS = ['red', 'orange', 'cyan', 'blue', 'silver', 'white'];

export function generateCaptcha(options: ICaptchaOptions = {}): { image: Buffer; captcha: string } {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  options.token = options.token || generateCaptchaToken(options);
  const { canvas, context } = initCanvas(options);
  drawCaptchaTokenText(context, options);
  drawParticles(context, options);
  const buffer = canvas.toBuffer('image/png');
  return { image: buffer, captcha: options.token };
}

function initCanvas(options: ICaptchaOptions) {
  const canvas = createCanvas(options.width!, options.height!);
  // We need to wait for node-canvas 3.0 for a proper typing here
  const context: CanvasRenderingContext2D = canvas.getContext('2d') as any;
  context.fillStyle = getBackgroundColor(options);
  context.fillRect(0, 0, options.width!, options.height!);
  return { canvas, context };
}

function getBackgroundColor(options: ICaptchaOptions) {
  return options.theme === 'dark' ? 'black' : 'white';
}

export function generateCaptchaToken(options = {} as ICaptchaOptions) {
  if (process.env.NODE_ENV === 'e2e') return '01234';
  options.length = options.length || DEFAULT_LENGTH;
  return Array.from({ length: options.length }, () =>
    DEFAULT_CAPTCHA_CHARS.charAt(randomInt(0, DEFAULT_CAPTCHA_CHARS.length - 1))
  ).join('');
}

function drawCaptchaTokenText(context: CanvasRenderingContext2D, options: ICaptchaOptions) {
  let x = 0;
  const y = 0;

  context.font = `${options.fontSize} ${options.font}`;
  context.textBaseline = 'top';
  context.textAlign = 'center';

  options.token!.split('').forEach((c, i) => {
    context.save();
    context.shadowColor = getBackgroundColor(options); // string
    context.shadowOffsetX = 0; // integer
    context.shadowOffsetY = 0; // integer
    context.shadowBlur = 10; // integer

    if (i % 2 === 0)
      context.setTransform(1, getRandomFloat(0, 0.1, 1), getRandomFloat(0, 0.1, 1), 1.0, 0, -10); // integer

    if (i % 2 !== 0)
      context.setTransform(1.0, getRandomFloat(0, 0.1, 1), getRandomFloat(0, 0.1, 1), 1.0, 0, -5); // integer

    const colors = ['red', 'gray', 'cyan', 'blue', 'silver'];

    context.fillStyle = colors.splice(getRandomInt(0, colors.length), 1)[0];
    context.fillText(c, 60 + x - getRandomInt(0, 7), y);
    context.fillStyle = colors.splice(getRandomInt(0, colors.length), 1)[0];
    context.fillText(c, 60 + x - getRandomInt(0, 1), y);
    context.fillStyle = colors.splice(getRandomInt(0, colors.length), 1)[0];
    context.fillText(c, 60 + x + getRandomInt(0, 7), y);

    context.fillStyle = getBackgroundColor(options);
    context.fillText(c, 61 + x, y);
    context.setTransform(1.0, 0.0, 0.0, 1.0, 0, 0);
    x += context.measureText(c).width + 30;
    context.restore();
  });
}

function drawParticles(context: CanvasRenderingContext2D, options: ICaptchaOptions) {
  for (let i = 0; i < options.particles!; i++) drawParticle(context, options);
}

function drawParticle(context: CanvasRenderingContext2D, options: ICaptchaOptions) {
  context.save();
  context.translate(getRandomInt(5, options.width!), getRandomInt(5, options.height!));
  const color = PARTICLE_COLORS[getRandomInt(0, PARTICLE_COLORS.length - 1)];
  context.shadowColor = color;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 10;

  context.fillStyle = color;
  context.beginPath();
  context.fillStyle = color;
  context.arc(0, 0, getRandomInt(1, 5), 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomFloat(min: number, max: number, decimals: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

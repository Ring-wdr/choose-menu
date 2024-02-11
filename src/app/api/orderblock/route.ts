import { getOrderBlock } from '@/database/coffeebean/get';

export const dynamic = 'force-dynamic'; // defaults to auto

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Notify {
  complete: (data: any) => void;
  error: (error: Error | any) => void;
  close: () => void;
}

const longRunning = async (notify: Notify) => {
  const isBlock = await getOrderBlock();
  notify.complete(isBlock && isBlock.status);
  await delay(5000);
  return isBlock?.status;
};

/**
 * Implements long running response. Only works with edge runtime.
 * @link https://github.com/vercel/next.js/issues/9965
 */
export async function GET() {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  let closed = false;

  // Invoke long running process
  try {
    const isBlock = await longRunning({
      complete: (obj: any) => {
        writer.write(encoder.encode('data: ' + JSON.stringify(obj) + '\n\n'));
        if (!closed) {
          writer.close();
          closed = true;
        }
      },
      error: (err: Error | any) => {
        writer.write(encoder.encode('data: ' + err?.message + '\n\n'));
        if (!closed) {
          writer.close();
          closed = true;
        }
      },
      close: () => {
        if (!closed) {
          writer.close();
          closed = true;
        }
      },
    });
    console.info('current block state sended!: ', isBlock ?? false);
    if (!closed) {
      writer.close();
    }
  } catch (e) {
    console.error('Failed', e);
    if (!closed) {
      writer.close();
    }
  }

  // Return response connected to readable
  return new Response(responseStream.readable, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'Content-Encoding': 'none',
    },
  });
}

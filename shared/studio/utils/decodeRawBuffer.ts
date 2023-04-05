import {_CodecsRegistry} from "edgedb";
import {QueryArgs} from "edgedb/dist/ifaces";
import {NamedTupleCodec} from "edgedb/dist/codecs/namedtuple";
import {TupleCodec} from "edgedb/dist/codecs/tuple";
import {decode as _decode, EdgeDBSet} from "@edgedb/common/decodeRawBuffer";

export type {EdgeDBSet};

function newCodecsRegistry() {
  const registry = new _CodecsRegistry();
  registry.setCustomCodecs({
    int64_bigint: true,
    datetime_localDatetime: true,
    json_string: true,
  });
  return registry;
}

export const codecsRegistry = newCodecsRegistry();

export function decode(
  outCodecBuf: Uint8Array,
  resultBuf: Uint8Array,
  newCodec: boolean = false
): EdgeDBSet | null {
  return _decode(
    newCodec ? newCodecsRegistry() : codecsRegistry,
    outCodecBuf,
    resultBuf,
    [1, 0]
  );
}

export type QueryParams = QueryArgs;

export function encodeArgs(inCodecBuf: Uint8Array, queryParams: QueryParams) {
  const inCodec = codecsRegistry.buildCodec(inCodecBuf, [1, 0]);

  if (!(inCodec instanceof NamedTupleCodec || inCodec instanceof TupleCodec)) {
    throw new Error("Invalid input codec");
  }

  return inCodec.encodeArgs(queryParams);
}

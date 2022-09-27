import { getNumberEnumKeys, getStringEnumKeys, getNumberEnumValues, getStringEnumValues } from "@/utils";

enum NumEnum {
  T1,
  T2,
  T3
}

enum StringEnum {
  T1 = 't1',
  T2 = 't2',
  T3 = 't3'
}

describe('enum util', () => {
  describe('getNumberEnumValues()', function () {
    it('test number enum values', async () => {
      const result = getNumberEnumValues(NumEnum);
      expect(result?.length).toEqual(3);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
    });
  });

  describe('getStringEnumValues()', function () {
    it('test string enum values', async () => {
      const result = getStringEnumValues(StringEnum);
      expect(result?.length).toEqual(3);
      expect(result[0]).toEqual('t1');
      expect(result[1]).toEqual('t2');
      expect(result[2]).toEqual('t3');
    });
  });

  describe('getNumberEnumKeys()', function () {
    it('test string enum values', async () => {
      const result = getNumberEnumKeys(NumEnum);
      expect(result?.length).toEqual(3);
      expect(result[0]).toEqual('T1');
      expect(result[1]).toEqual('T2');
      expect(result[2]).toEqual('T3');
    });
  });

  describe('getStringEnumKeys()', function () {
    it('test string enum values', async () => {
      const result = getStringEnumKeys(StringEnum);
      expect(result?.length).toEqual(3);
      expect(result[0]).toEqual('T1');
      expect(result[1]).toEqual('T2');
      expect(result[2]).toEqual('T3');
    });
  });
});

describe('my first test', () => {
  let sut; // system under test(sut)

  // NOTE: non critical for the unit under test setup, should be moved out to the beforeEach
  beforeEach(() => {
    sut = {};
  });

  // NOTE: critical setup should be in the it
  it('should be true if true', () => {
    // arrange
    sut.a = false;

    // act
    sut.a = true;

    // assert
    expect(sut.a).toBe(true);
  });
});

import {clearMarkPoint, measureMarkPoint, setMarkPoint} from "../../lib";

describe('[file: PerformanceUtils.ts] usage case', function () {

	describe('mark point measure usage case', function () {
		jest.setTimeout(6000);

		it('set mark points, calc execute time', async () => {
			setMarkPoint('testMarkPoints', 0);
			await new Promise(resolve => setTimeout(resolve, 1000));
			setMarkPoint('testMarkPoints', 1);

			const res = measureMarkPoint('testMarkPoints', 0, 1);
			expect(res.length).toBe(1);
			expect(typeof res[0]).toBe('number');
			clearMarkPoint('testMarkPoints');
		});

		it('set mark points repeat, calc execute time', async () => {
			setMarkPoint('testMarkPoints', 0);
			await new Promise(resolve => setTimeout(resolve, 1000));
			setMarkPoint('testMarkPoints', 1);
			await new Promise(resolve => setTimeout(resolve, 1000));
			setMarkPoint('testMarkPoints', 1);
			expect(Math.round(measureMarkPoint('testMarkPoints', 0, 1)[0])).toBeGreaterThanOrEqual(2000);

			setMarkPoint('testMarkPoints', 2);
			await new Promise(resolve => setTimeout(resolve, 1000));
			setMarkPoint('testMarkPoints', 3);
			await new Promise(resolve => setTimeout(resolve, 2000));
			setMarkPoint('testMarkPoints', 2);
			expect(Math.round(measureMarkPoint('testMarkPoints', 2, 3)[0])).toBeLessThanOrEqual(-2000);
		});
	})
});

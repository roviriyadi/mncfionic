import { NgModule } from '@angular/core';
import { ImagecacheDirective } from './imagecache/imagecache';
import { NamaKotaDirective } from './nama-kota/namakota';
import { KonsumenCountBadgeDirective } from './konsumen-count-badge/konsumen-count-badge';
import { NamaStatusProspectingDirective } from './nama-status-prospecting/namastatusprospecting';

@NgModule({
	declarations: [
		ImagecacheDirective,
		NamaKotaDirective,
		KonsumenCountBadgeDirective,
		NamaStatusProspectingDirective
	],
	imports: [],
	exports: [
		ImagecacheDirective,
		NamaKotaDirective,
		KonsumenCountBadgeDirective,
		NamaStatusProspectingDirective
	]
})
export class DirectivesModule {}
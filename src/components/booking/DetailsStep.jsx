import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DetailsStep({ formData, onChange }) {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-2xl font-light text-foreground mb-2">
        {t('booking.yourDetails')}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.name')} *</Label>
          <Input
            value={formData.client_name || ''}
            onChange={(e) => handleChange('client_name', e.target.value)}
            className="h-12 rounded-xl font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.email')} *</Label>
          <Input
            type="email"
            value={formData.client_email || ''}
            onChange={(e) => handleChange('client_email', e.target.value)}
            className="h-12 rounded-xl font-body"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.phone')}</Label>
          <Input
            type="tel"
            value={formData.client_phone || ''}
            onChange={(e) => handleChange('client_phone', e.target.value)}
            className="h-12 rounded-xl font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.propertyType')}</Label>
          <Select value={formData.property_type || ''} onValueChange={(v) => handleChange('property_type', v)}>
            <SelectTrigger className="h-12 rounded-xl font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="condo">{t('booking.condo')}</SelectItem>
              <SelectItem value="house">{t('booking.house')}</SelectItem>
              <SelectItem value="vacation_rental">{t('booking.vacationRental')}</SelectItem>
              <SelectItem value="other">{t('booking.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm">{t('booking.address')}</Label>
        <Input
          value={formData.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          className="h-12 rounded-xl font-body"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.bedrooms')}</Label>
          <Select value={String(formData.bedrooms || '')} onValueChange={(v) => handleChange('bedrooms', Number(v))}>
            <SelectTrigger className="h-12 rounded-xl font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-body text-sm">{t('booking.bathrooms')}</Label>
          <Select value={String(formData.bathrooms || '')} onValueChange={(v) => handleChange('bathrooms', Number(v))}>
            <SelectTrigger className="h-12 rounded-xl font-body">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm">{t('booking.notes')}</Label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="rounded-xl font-body min-h-[100px]"
        />
      </div>
    </div>
  );
}
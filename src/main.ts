import { Plugin } from 'obsidian';
import {
  DEFAULT_SETTINGS,
  ImageTitleSettingTab,
  type ImageTitleSettings,
} from './settings';

export default class ImageTitlePlugin extends Plugin {
  settings!: ImageTitleSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ImageTitleSettingTab(this.app, this));

    this.registerMarkdownPostProcessor((element) => {
      const images = element.querySelectorAll<HTMLImageElement>('img[alt]');
      images.forEach((img) => {
        const rawAlt = img.getAttribute('alt') ?? '';

        // Strip size parameters: |N or |NxN
        const cleanedAlt = rawAlt.replace(/\|\d+(?:x\d+)?$/, '').trim();
        if (!cleanedAlt) return;

        const parent = img.parentElement;
        if (!parent) return;

        // Avoid double-wrapping
        if (parent.classList.contains('image-title-figure')) return;

        const figure = document.createElement('figure');
        figure.className = 'image-title-figure';
        const caption = document.createElement('figcaption');
        caption.className = 'image-title-caption';
        caption.textContent = cleanedAlt;

        parent.insertBefore(figure, img);
        figure.appendChild(img);

        if (this.settings.titlePosition === 'above') {
          figure.insertBefore(caption, img);
        } else {
          figure.appendChild(caption);
        }
      });
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<ImageTitleSettings>,
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

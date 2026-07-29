import { App, PluginSettingTab, Setting } from 'obsidian';
import type ImageTitlePlugin from './main';

export interface ImageTitleSettings {
  titlePosition: 'above' | 'below';
}

export const DEFAULT_SETTINGS: ImageTitleSettings = {
  titlePosition: 'below',
};

export class ImageTitleSettingTab extends PluginSettingTab {
  plugin: ImageTitlePlugin;

  constructor(app: App, plugin: ImageTitlePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Title position')
      .setDesc('Where to show the image title relative to the image')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('above', 'Above image')
          .addOption('below', 'Below image')
          .setValue(this.plugin.settings.titlePosition)
          .onChange(async (value) => {
            this.plugin.settings.titlePosition = value as 'above' | 'below';
            await this.plugin.saveSettings();
          }),
      );
  }
}

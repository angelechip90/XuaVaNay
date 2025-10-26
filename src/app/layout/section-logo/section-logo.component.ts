import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-section-logo',
  templateUrl: './section-logo.component.html',
  styleUrls: ['./section-logo.component.scss'],
  standalone: true,
  imports: [],
})
export class SectionLogoComponent implements OnInit, AfterViewInit {
  svgId: string = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;

  constructor(
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Ensure all <defs> IDs inside the inline SVG are unique per component instance,
    // and rewrite all url(#id)/#id references accordingly to avoid collisions when
    // Ionic keeps previous pages alive in the DOM.
    try {
      const root: HTMLElement = this.host.nativeElement;
      const svg: SVGElement | null = root.querySelector('svg');
      if (!svg) return;

      const uid = Math.random().toString(36).slice(2, 10);

      // Collect mapping of oldId -> newId
      const idMap = new Map<string, string>();
      const elementsWithId = svg.querySelectorAll<HTMLElement>('[id]');
      elementsWithId.forEach((el) => {
        const oldId = el.getAttribute('id');
        if (!oldId) return;
        const newId = `${oldId}__${uid}`;
        idMap.set(oldId, newId);
        this.renderer.setAttribute(el, 'id', newId);
      });

      if (idMap.size === 0) return;

      // Attributes that can contain url(#id) or #id references
      const ATTRS_TO_SCAN = [
        'href',
        'xlink:href',
        'filter',
        'fill',
        'stroke',
        'clip-path',
        'mask',
        'style',
      ];

      const allNodes = svg.querySelectorAll<HTMLElement>('*');
      allNodes.forEach((node) => {
        ATTRS_TO_SCAN.forEach((attr) => {
          const val = node.getAttribute(attr);
          if (!val) return;

          let newVal = val;

          // Replace url(#id)
          newVal = newVal.replace(
            /url\(#([^\)]+)\)/g,
            (m: string, id: string) => {
              const mapped = idMap.get(id);
              return mapped ? `url(#${mapped})` : m;
            }
          );

          // Replace standalone #id (e.g., xlink:href="#id" or href="#id")
          if (newVal.startsWith('#')) {
            const ref = newVal.slice(1);
            const mapped = idMap.get(ref);
            if (mapped) newVal = `#${mapped}`;
          }

          if (newVal !== val) {
            this.renderer.setAttribute(node, attr, newVal);
          }
        });
      });
    } catch {
      // best-effort; ignore if anything goes wrong
    }
  }
}

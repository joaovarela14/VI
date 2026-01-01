from vtkmodules.all import *

class vtkMyCallback:
    def __init__(self, picker, sphere_actor, render_window):
        self.picker = picker
        self.sphere_actor = sphere_actor
        self.render_window = render_window
    
    def __call__(self, obj, event):
        pickPosition = self.picker.GetPickPosition()
        print(f"Picked point coordinates: {pickPosition}")
        
        # Update the position of the selected sphere
        self.sphere_actor.SetPosition(pickPosition)
        self.sphere_actor.VisibilityOn()
        self.sphere_actor.GetProperty().SetColor(1.0, 0.0, 0.0)
        self.render_window.Render()

def render_cone():

    coneSource = vtkConeSource()
    coneSource.SetCenter(0.5, 0.0, 0.5)
    coneSource.SetHeight(2.0)
    coneSource.SetRadius(1.0)
    coneSource.SetResolution(5)

    return coneSource

def render_sphere():
    sphereSource = vtkSphereSource()
    sphereSource.SetCenter(-2.0, 0.0, -2.0)
    sphereSource.SetRadius(2.0)
    sphereSource.SetPhiResolution(10)
    sphereSource.SetThetaResolution(10)

    return sphereSource

def main():
    # Cone setup
    coneSource = render_cone()
    coneMapper = vtkPolyDataMapper()
    coneMapper.SetInputConnection(coneSource.GetOutputPort())
    
    coneActor = vtkActor()
    coneActor.SetMapper(coneMapper)

    # Sphere setup
    sphereSource = render_sphere()
    sphereMapper = vtkPolyDataMapper()
    sphereMapper.SetInputConnection(sphereSource.GetOutputPort())
    
    sphereActor = vtkActor()
    sphereActor.SetMapper(sphereMapper)

    # Glyph setup (glyphing the cone onto the sphere)
    glyph = vtkGlyph3D()
    glyph.SetSourceConnection(coneSource.GetOutputPort())  # Cone as the glyph
    glyph.SetInputConnection(sphereSource.GetOutputPort())  # Sphere defines placement
    glyph.SetScaleFactor(0.25)
    glyph.SetVectorModeToUseNormal()
    
    glyphMapper = vtkPolyDataMapper()
    glyphMapper.SetInputConnection(glyph.GetOutputPort())

    glyphActor = vtkActor()
    glyphActor.SetMapper(glyphMapper)

    # Renderer setup
    renderer = vtkRenderer()  
    renderer.AddActor(sphereActor)
    renderer.AddActor(glyphActor) 
    renderer.SetBackground(0.2, 0.3, 0.4)
    renderWindow = vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(600, 600)
    renderWindow.SetWindowName("Picking")

    iren = vtkRenderWindowInteractor()
    iren.SetRenderWindow(renderWindow)

    # Sphere for selected point
    selectedSphereSource = vtkSphereSource()
    selectedSphereSource.SetRadius(0.1)

    selectedSphereMapper = vtkPolyDataMapper()
    selectedSphereMapper.SetInputConnection(selectedSphereSource.GetOutputPort())

    selectedSphereActor = vtkActor()
    selectedSphereActor.SetMapper(selectedSphereMapper)
    selectedSphereActor.VisibilityOff()
    renderer.AddActor(selectedSphereActor)

    # Picker setup
    myPicker = vtkPointPicker()
    mo1 = vtkMyCallback(myPicker, selectedSphereActor, renderWindow)
    myPicker.AddObserver(vtkCommand.EndPickEvent, mo1)
    
    iren.SetPicker(myPicker)

    renderWindow.Render()
    iren.Initialize()
    iren.Start()

if __name__ == "__main__":
    main()